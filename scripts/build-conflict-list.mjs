// Build a normalized conflict-check list from "master client list.xlsx".
//
// Reads the "Client List" sheet, parses dates, drops entries before 2016,
// normalizes names to "First Last" (Title Case), splits joint clients,
// captures aliases (aka / maiden names), and writes:
//   - data/conflicts.json  (machine-readable, for the server endpoint)
//   - data/conflicts-review.xlsx  (human-readable, for staff to sanity-check)
//
// Usage:
//   node scripts/build-conflict-list.mjs            # local build only
//   node scripts/build-conflict-list.mjs --push     # also upload to Vercel
//                                                   # Blob (production data)
//
// --push requires BLOB_READ_WRITE_TOKEN in env. Use:
//   node --env-file=.env.local scripts/build-conflict-list.mjs --push
// or `npm run conflicts:push` which does the same.

import xlsx from "xlsx";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SOURCE = resolve(ROOT, "master client list.xlsx");
const OUT_DIR = resolve(ROOT, "data");
const OUT_JSON = resolve(OUT_DIR, "conflicts.json");
const OUT_XLSX = resolve(OUT_DIR, "conflicts-review.xlsx");

const MIN_YEAR = 2016;

// ---------- date parsing ----------

const MONTHS = {
  jan: 1, january: 1, jna: 1, // "Jna" typo
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4, apor: 4, apri: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, spet: 9, september: 9,
  oct: 10, october: 10, octobr: 10, // "Octobr" typo
  nov: 11, november: 11,
  dec: 12, december: 12,
};

function parseDate(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;

  // Excel serial number (rare here since sheet was read with raw:false, but defensive)
  if (/^\d{4,5}(\.\d+)?$/.test(s)) {
    const serial = Number(s);
    const ms = (serial - 25569) * 86400 * 1000;
    const d = new Date(ms);
    if (!isNaN(d)) return d;
  }

  // "24-Jun-25" or "24-June-2025"
  let m = s.match(/^(\d{1,2})[-\s]([A-Za-z]+)[-\s](\d{2,4})$/);
  if (m) return ymd(m[3], MONTHS[m[2].toLowerCase()], m[1]);

  // "July 2.25" / "July 02.2025" / "July 2 25" / "July 2, 2025"
  m = s.match(/^([A-Za-z]+)[\s.]+(\d{1,2})[\s.,]+(\d{2,4})$/);
  if (m) return ymd(m[3], MONTHS[m[1].toLowerCase()], m[2]);

  // "Mar.06.2026" / "Apr.07.26" / "Apri.15.26"
  m = s.match(/^([A-Za-z]+)\.(\d{1,2})\.(\d{2,4})$/);
  if (m) return ymd(m[3], MONTHS[m[1].toLowerCase()], m[2]);

  // "Mar 10 26" / "Apr 23 26"
  m = s.match(/^([A-Za-z]+)\s+(\d{1,2})\s+(\d{2,4})$/);
  if (m) return ymd(m[3], MONTHS[m[1].toLowerCase()], m[2]);

  // ISO-ish "2025-06-24" or "06/24/2025" or "2025 08 28"
  m = s.match(/^(\d{4})[-/\s](\d{1,2})[-/\s](\d{1,2})$/);
  if (m) return ymd(m[1], Number(m[2]), m[3]);
  m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
  if (m) return ymd(m[3], Number(m[2]), m[1]);

  return null;
}

function ymd(yearRaw, month, dayRaw) {
  if (!month) return null;
  let year = Number(yearRaw);
  if (isNaN(year)) return null;
  if (year < 100) year += year < 50 ? 2000 : 1900;
  // Three-digit typo year (e.g. "225" meant "25" → 2025): take last two digits
  else if (year < 1000) {
    const tail = year % 100;
    year = tail + (tail < 50 ? 2000 : 1900);
  }
  const day = Number(dayRaw);
  if (isNaN(day)) return null;
  const d = new Date(year, month - 1, day);
  if (isNaN(d)) return null;
  return d;
}

// ---------- name normalization ----------

function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/\b(\p{L})(\p{L}*)/gu, (_, a, b) => a.toUpperCase() + b)
    // McSomething, MacSomething
    .replace(/\bMc(\p{L})/gu, (_, c) => "Mc" + c.toUpperCase())
    // Hyphenated parts: smith-jones → Smith-Jones
    .replace(/-(\p{L})/gu, (_, c) => "-" + c.toUpperCase())
    // O'Brien
    .replace(/'(\p{L})/gu, (_, c) => "'" + c.toUpperCase());
}

function cleanWhitespace(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

// Extract aliases (parentheticals only — "aka" is handled in splitNames).
// Returns { primary, aliases[] }
function extractParenAliases(rawName) {
  const aliases = [];
  let s = cleanWhitespace(rawName);

  // "(Maiden Name)" or "(Maiden last name X)" — capture as alias
  const parenMatches = [...s.matchAll(/\(([^)]+)\)/g)];
  for (const pm of parenMatches) {
    const inner = cleanWhitespace(pm[1])
      .replace(/^maiden\s+(?:last\s+)?(?:name\s*)?:?\s*/i, "")
      .replace(/^ne[ée]\s+/i, "");
    if (inner && /\p{L}/u.test(inner)) aliases.push(inner);
  }
  s = s.replace(/\([^)]*\)/g, "").trim();
  // Trailing open paren ("(Maiden last " with no close)
  s = s.replace(/\([^)]*$/, "").trim();

  return { primary: s, aliases };
}

// Split a single Client Name cell into one or more (primary, aliases) entries.
function splitNames(rawCell) {
  const cell = cleanWhitespace(rawCell);
  if (!cell) return [];

  // Handle "X aka Y" / "X a.k.a. Y" / "X also known as Y" before splitting on "and".
  // The shape we see in this dataset: "LastA aka LastB" or
  // "LastA aka LastB, First" — meaning the same person, two surnames.
  // Treat LastA + (commafirst) as primary, LastB + (commafirst) as alias.
  let primaryStr = cell;
  let akaAlias = null;
  const akaMatch = cell.match(/^(.+?)\s+(?:aka|a\.k\.a\.?|also\s+known\s+as)\s+(.+)$/i);
  if (akaMatch) {
    const left = akaMatch[1].trim();
    const right = akaMatch[2].trim();
    // If right side has a comma, the part after the comma is the first name
    // shared by both surnames: "Hetman aka Burr, Lisa Ann"
    //   → primary "Hetman, Lisa Ann"  alias "Burr, Lisa Ann"
    const rightCommaIdx = right.indexOf(",");
    if (rightCommaIdx > -1) {
      const rightLast = right.slice(0, rightCommaIdx).trim();
      const sharedFirst = right.slice(rightCommaIdx + 1).trim();
      primaryStr = `${left}, ${sharedFirst}`;
      akaAlias = `${rightLast}, ${sharedFirst}`;
    } else {
      const leftTokens = left.split(/\s+/);
      const rightTokens = right.split(/\s+/);
      // "Yanhong Zhang AKA Yan Hong Zhang" — both sides are full names.
      // If left has 2+ tokens, treat each side as a complete name.
      if (leftTokens.length >= 2) {
        primaryStr = left;
        akaAlias = right;
      } else if (rightTokens.length >= 2) {
        // "Gunderson aka Oviatt Lori" — left is single surname, right is "Last First"
        const sharedFirst = rightTokens[rightTokens.length - 1];
        const rightLast = rightTokens.slice(0, -1).join(" ");
        primaryStr = `${left}, ${sharedFirst}`;
        akaAlias = `${rightLast}, ${sharedFirst}`;
      } else {
        primaryStr = left;
        akaAlias = right;
      }
    }
  }

  // Strip trailing junk that sometimes pollutes name cells (phone numbers, emails)
  primaryStr = primaryStr
    .replace(/\s+\+?\d[\d\s().-]{6,}$/g, "") // trailing phone number
    .replace(/\s+\S+@\S+$/g, "")              // trailing email
    .trim();

  // Joint clients: "X and Y", "X & Y", "X / Y", "X ; Y", "X + Y",
  // "X on behalf of Y" (representative-relationship — both names matter)
  const joint = primaryStr
    .split(/\s+(?:and|&)\s+|\s*[\/;+]\s*|\s+on\s+behalf\s+of\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);

  // If a joint piece is a single token (no surname), inherit surname from
  // a sibling that has 2+ tokens. "Felix and Ashley Yan" → "Felix Yan" + "Ashley Yan"
  const surnameDonor = joint
    .map((p) => p.replace(/\([^)]*\)/g, "").trim().split(/\s+/))
    .find((toks) => toks.length >= 2);
  const inheritedSurname = surnameDonor ? surnameDonor[surnameDonor.length - 1] : null;

  const results = [];
  for (const piece of joint) {
    let working = piece;
    const tokens = working.replace(/\([^)]*\)/g, "").trim().split(/\s+/);
    if (tokens.length === 1 && inheritedSurname && tokens[0].toLowerCase() !== inheritedSurname.toLowerCase()) {
      working = `${tokens[0]} ${inheritedSurname}`;
    }
    const { primary, aliases } = extractParenAliases(working);
    if (primary) results.push({ rawName: primary, aliases });
  }

  // The "aka" alias attaches to the first (primary) record only.
  if (akaAlias && results.length) {
    results[0].aliases.push(akaAlias);
  }

  return results;
}

// Normalize a single name to "First Last" Title Case.
// Handles "LAST, First" (comma form) and "First Last" (space form).
function normalizeName(raw) {
  const s = cleanWhitespace(raw);
  if (!s) return null;

  let normalized;
  if (s.includes(",")) {
    // "LAST, First Middle" → "First Middle Last"
    const [last, rest] = s.split(",", 2).map((p) => p.trim());
    if (!last || !rest) {
      normalized = s;
    } else {
      normalized = `${rest} ${last}`;
    }
  } else {
    normalized = s;
  }

  // Strip stray punctuation at edges
  normalized = normalized.replace(/^[\s.,;]+|[\s.,;]+$/g, "");
  normalized = cleanWhitespace(normalized);
  if (!normalized) return null;

  return titleCase(normalized);
}

// Build a comparison key (lowercase, alpha-only, sorted tokens)
// so "Robert W Evans" and "Evans, Robert W" collide.
function comparisonKey(name) {
  if (!name) return "";
  const tokens = name
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .sort();
  return tokens.join(" ");
}

// ---------- block detection in Client List sheet ----------
//
// The "Client List" sheet has the standard 6-column block (Date | Client Name
// | Opposing Party | Type of Client | Lawyer | File No.) repeated dozens of
// times across hundreds of columns, with no consistent spacing — old data,
// inserted columns, copy-paste shuffles. We detect blocks by finding columns
// where many cells parse as dates AND the next column has name-like content.

function looksLikeName(s) {
  const v = String(s ?? "").trim();
  if (!v) return false;
  if (parseDate(v)) return false; // dates aren't names
  // At least one alphabetic token of 2+ chars
  if (!/[A-Za-z]{2,}/.test(v)) return false;
  // Reject obvious non-names: pure numbers, file labels, mostly punctuation
  if (/^\d+$/.test(v)) return false;
  return true;
}

function findBlockStarts(sheet, range) {
  const blockStarts = [];
  for (let c = 0; c <= range.e.c; c++) {
    let dateCount = 0;
    let nameCount = 0;
    let bothCount = 0;
    for (let r = 0; r <= range.e.r; r++) {
      const dCell = sheet[xlsx.utils.encode_cell({ r, c })];
      const nCell = sheet[xlsx.utils.encode_cell({ r, c: c + 1 })];
      const dHasDate = dCell && parseDate(dCell.v);
      const nHasName = nCell && looksLikeName(nCell.v);
      if (dHasDate) dateCount++;
      if (nHasName) nameCount++;
      if (dHasDate && nHasName) bothCount++;
    }
    // Require: at least 3 dates in column C AND at least 3 rows where both
    // C is a date and C+1 is a name.
    if (dateCount >= 3 && bothCount >= 3) {
      blockStarts.push({ col: c, dateCount, nameCount, bothCount });
    }
  }
  return blockStarts;
}

function readClientListBlock(sheet, range, startCol) {
  // Column layout: 0=Date, 1=Client Name, 2=Opposing Party,
  // 3=Type of Client, 4=Lawyer, 5=File No.
  const records = [];
  for (let r = 0; r <= range.e.r; r++) {
    const dCell = sheet[xlsx.utils.encode_cell({ r, c: startCol })];
    const cCell = sheet[xlsx.utils.encode_cell({ r, c: startCol + 1 })];
    const oCell = sheet[xlsx.utils.encode_cell({ r, c: startCol + 2 })];
    const lCell = sheet[xlsx.utils.encode_cell({ r, c: startCol + 4 })];
    const fCell = sheet[xlsx.utils.encode_cell({ r, c: startCol + 5 })];

    const dateRaw = dCell?.v;
    const clientRaw = cCell?.v;
    if (!String(clientRaw ?? "").trim()) continue;

    const date = parseDate(dateRaw);
    if (!date) continue;
    if (date.getFullYear() < MIN_YEAR) continue;

    records.push({
      date: date.toISOString().slice(0, 10),
      clientRaw: String(clientRaw),
      opposingRaw: String(oCell?.v ?? ""),
      lawyer: cleanWhitespace(lCell?.v ?? ""),
      fileNo: cleanWhitespace(fCell?.v ?? ""),
      sourceCol: xlsx.utils.encode_col(startCol),
      sourceRow: r + 1,
    });
  }
  return records;
}

// ---------- main ----------

async function pushToBlob(payload) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error(
      "\nERROR: --push requires BLOB_READ_WRITE_TOKEN in env."
    );
    console.error(
      "Either run via `npm run conflicts:push` (loads .env.local), or"
    );
    console.error(
      "set BLOB_READ_WRITE_TOKEN before invoking node directly.\n"
    );
    process.exit(1);
  }
  // Dynamic import so a regular local build doesn't pay the cost.
  const { put } = await import("@vercel/blob");
  const result = await put(
    "conflicts/current.json",
    JSON.stringify(payload),
    {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      token,
    }
  );
  console.log(`\nPushed to Vercel Blob:`);
  console.log(`  ${result.url}`);
  console.log(
    `  (${payload.records.length} records — live on next cold start of the serverless function)`
  );
}

async function run() {
  const wb = xlsx.readFile(SOURCE);
  const sheet = wb.Sheets["Client List"];
  if (!sheet) throw new Error("Sheet 'Client List' not found");
  const range = xlsx.utils.decode_range(sheet["!ref"]);

  // Detect every (Date, Client Name, Opposing Party, ...) block across the sheet.
  const blockStarts = findBlockStarts(sheet, range);

  // Read raw entries from every detected block.
  const rawEntries = [];
  for (const b of blockStarts) {
    rawEntries.push(...readClientListBlock(sheet, range, b.col));
  }

  // Normalise into client records (split joints, capture aliases, flip "Last, First").
  const records = [];
  for (const e of rawEntries) {
    const clientPieces = splitNames(e.clientRaw);
    const opposingPieces = splitNames(e.opposingRaw);

    for (const client of clientPieces) {
      const primary = normalizeName(client.rawName);
      if (!primary) continue;
      const aliases = client.aliases.map(normalizeName).filter(Boolean);
      const opposing = opposingPieces.map((p) => normalizeName(p.rawName)).filter(Boolean);

      records.push({
        date: e.date,
        dateLabel: e.date,
        clientName: primary,
        clientKey: comparisonKey(primary),
        clientAliases: aliases,
        clientAliasKeys: aliases.map(comparisonKey).filter(Boolean),
        opposingNames: opposing,
        opposingKeys: opposing.map(comparisonKey).filter(Boolean),
        lawyer: e.lawyer,
        fileNo: e.fileNo,
        sourceSheet: "Client List",
        sourceCol: e.sourceCol,
        sourceRow: e.sourceRow,
      });
    }
  }

  // De-dupe by clientKey alone — same person across multiple blocks is the same person.
  // For ties, keep the earliest date (oldest matter is the loyalty trigger), and
  // accumulate opposing names + aliases across all duplicates.
  const seen = new Map();
  for (const r of records) {
    const existing = seen.get(r.clientKey);
    if (!existing) {
      seen.set(r.clientKey, { ...r });
      continue;
    }
    // merge: keep earliest date, accumulate opposing & aliases
    if (r.date < existing.date) {
      existing.date = r.date;
      existing.dateLabel = r.dateLabel;
      existing.lawyer = r.lawyer || existing.lawyer;
      existing.fileNo = r.fileNo || existing.fileNo;
      existing.sourceCol = r.sourceCol;
      existing.sourceRow = r.sourceRow;
    }
    for (const n of r.opposingNames) {
      if (!existing.opposingNames.includes(n)) {
        existing.opposingNames.push(n);
        existing.opposingKeys.push(comparisonKey(n));
      }
    }
    for (let i = 0; i < r.clientAliases.length; i++) {
      const a = r.clientAliases[i];
      if (!existing.clientAliases.includes(a)) {
        existing.clientAliases.push(a);
        existing.clientAliasKeys.push(r.clientAliasKeys[i]);
      }
    }
  }
  const deduped = [...seen.values()].sort((a, b) => a.clientName.localeCompare(b.clientName));

  // Write JSON output
  mkdirSync(OUT_DIR, { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceFile: "master client list.xlsx",
    minYear: MIN_YEAR,
    totalRecords: deduped.length,
    records: deduped,
  };
  writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), "utf8");

  // Write human-readable XLSX
  const reviewRows = [
    ["Date", "Client Name", "Aliases", "Opposing Party(ies)", "Lawyer", "File No.", "Source Col", "Source Row"],
    ...deduped.map((r) => [
      r.dateLabel,
      r.clientName,
      r.clientAliases.join(" | "),
      r.opposingNames.join(" | "),
      r.lawyer,
      r.fileNo,
      r.sourceCol,
      r.sourceRow,
    ]),
  ];
  const outWb = xlsx.utils.book_new();
  const outSheet = xlsx.utils.aoa_to_sheet(reviewRows);
  outSheet["!cols"] = [
    { wch: 12 }, { wch: 32 }, { wch: 28 }, { wch: 36 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 8 },
  ];
  xlsx.utils.book_append_sheet(outWb, outSheet, "Conflicts");
  xlsx.writeFile(outWb, OUT_XLSX);

  // Report
  console.log(`Source: ${SOURCE}`);
  console.log(`Min year: ${MIN_YEAR}`);
  console.log(`Detected blocks in "Client List": ${blockStarts.length}`);
  console.log(`Raw entries (across all blocks, post-${MIN_YEAR}): ${rawEntries.length}`);
  console.log(`Unique clients (after dedupe by name): ${deduped.length}`);
  console.log(`\nDetected block start columns:`);
  console.log(`  ${blockStarts.map((b) => xlsx.utils.encode_col(b.col)).join(" ")}`);
  console.log(`\nWrote: ${OUT_JSON}`);
  console.log(`Wrote: ${OUT_XLSX}`);

  // Sample output for sanity check
  console.log(`\n--- First 8 normalized records ---`);
  for (const r of deduped.slice(0, 8)) {
    console.log(`  ${r.date}  ${r.clientName.padEnd(30)} vs ${(r.opposingNames.join(", ") || "(none)").slice(0, 40)}  [${r.lawyer}/${r.fileNo}]`);
  }

  // Optional: push to Vercel Blob so production picks up the new dataset.
  if (process.argv.includes("--push")) {
    await pushToBlob(payload);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
