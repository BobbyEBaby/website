// Server-only conflict-check library. NEVER import from a client component —
// the client list is PII and must not ship to the browser.
//
// Screens an inbound (clientName, opposingName) pair against every former-
// client record and returns hits with a match type + score. The contact-form
// and booking flow each call this on the server before sending the firm an
// email.
//
// Data source:
//   - On Vercel (process.env.VERCEL set):  fetched from Vercel Blob at
//     `conflicts/current.json`. Updates take effect on the next cold start
//     of the function. Push a new dataset with `npm run conflicts:push`.
//   - Locally:  read from `data/conflicts.json` (gitignored). Regenerate
//     with `npm run conflicts:build` after refreshing the master xlsx.
//
// The dataset is cached per process via a module-level Promise so concurrent
// first requests share one fetch.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { head } from "@vercel/blob";

const BLOB_PATHNAME = "conflicts/current.json";

type ConflictRecord = {
  date: string | null;
  dateLabel?: string;
  clientName: string;
  clientKey: string;
  clientAliases: string[];
  clientAliasKeys: string[];
  opposingNames: string[];
  opposingKeys: string[];
  lawyer: string;
  fileNo: string;
};

type ConflictData = {
  generatedAt: string;
  totalRecords: number;
  records: ConflictRecord[];
};

let cachePromise: Promise<ConflictData> | null = null;

function loadData(): Promise<ConflictData> {
  if (cachePromise) return cachePromise;
  cachePromise = doLoad().catch((e) => {
    // Don't poison the cache on transient failure — clear so next call retries.
    cachePromise = null;
    throw e;
  });
  return cachePromise;
}

async function doLoad(): Promise<ConflictData> {
  // On Vercel, always pull from blob. Locally, read the file the build script
  // wrote. (Set VERCEL=1 in .env.local if you want to point local dev at blob
  // for end-to-end testing.)
  if (process.env.VERCEL) {
    return loadFromBlob();
  }
  return loadFromFile();
}

async function loadFromBlob(): Promise<ConflictData> {
  try {
    const meta = await head(BLOB_PATHNAME);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Blob fetch returned HTTP ${res.status}`);
    }
    const json = (await res.json()) as ConflictData;
    console.log(
      `[conflict-check] loaded ${json.records.length} records from Vercel Blob`
    );
    return json;
  } catch (e) {
    console.warn(
      "[conflict-check] Blob load failed — screening disabled for this instance",
      e
    );
    return { generatedAt: "", totalRecords: 0, records: [] };
  }
}

async function loadFromFile(): Promise<ConflictData> {
  const path = join(process.cwd(), "data", "conflicts.json");
  try {
    const raw = readFileSync(path, "utf8");
    const json = JSON.parse(raw) as ConflictData;
    console.log(
      `[conflict-check] loaded ${json.records.length} records from ${path}`
    );
    return json;
  } catch {
    console.warn(
      `[conflict-check] dataset not available at ${path} — screening disabled`
    );
    return { generatedAt: "", totalRecords: 0, records: [] };
  }
}

function comparisonKey(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

function tokens(key: string): string[] {
  return key.split(" ").filter(Boolean);
}

function isSubset(small: string[], large: string[]): boolean {
  if (small.length === 0) return false;
  const set = new Set(large);
  return small.every((t) => set.has(t));
}

export type ConflictMatchType =
  | "opposing-is-stored-client" // CRITICAL — typed opposing name was a former client
  | "opposing-is-stored-client-alias"
  | "client-is-stored-client" // typed client name appears as a former client
  | "client-is-stored-client-alias"
  | "client-was-stored-opposing" // typed client appears as a former opposing party
  | "opposing-was-stored-opposing"; // typed opposing was a former opposing party

export type ConflictHit = {
  type: ConflictMatchType;
  matchScore: 1 | 0.8; // 1 = exact key match; 0.8 = token-subset partial match
  matchedAgainst: string;
  record: ConflictRecord;
};

export type ConflictCheckResult = {
  hits: ConflictHit[];
  totalRecords: number;
  hadDataset: boolean;
};

export type ConflictCheckInput = {
  clientName: string;
  opposingName: string;
};

const PARTIAL_MIN_TOKENS = 2; // require ≥ 2 tokens overlap to flag a partial

/**
 * Aggressive on the firm side: returns every plausible match so a human can
 * triage. Both exact key matches and 2+ token subset matches are returned.
 * Single-token typed names (e.g. "Smith") only produce exact matches to avoid
 * 90 false flags.
 */
export async function checkConflict(
  input: ConflictCheckInput
): Promise<ConflictCheckResult> {
  const data = await loadData();
  if (!data.records.length) {
    return { hits: [], totalRecords: 0, hadDataset: false };
  }

  const clientKey = comparisonKey(input.clientName);
  const opposingKey = comparisonKey(input.opposingName);
  const clientToks = tokens(clientKey);
  const opposingToks = tokens(opposingKey);

  const hits: ConflictHit[] = [];

  // Helper to test typed input against one stored key, pushing a hit if found.
  const testPair = (
    typedKey: string,
    typedToks: string[],
    storedKey: string,
    storedDisplay: string,
    type: ConflictMatchType,
    record: ConflictRecord
  ) => {
    if (!typedKey || !storedKey) return;
    if (typedKey === storedKey) {
      hits.push({ type, matchScore: 1, matchedAgainst: storedDisplay, record });
      return;
    }
    const storedToks = tokens(storedKey);
    if (
      typedToks.length >= PARTIAL_MIN_TOKENS &&
      storedToks.length >= PARTIAL_MIN_TOKENS &&
      (isSubset(typedToks, storedToks) || isSubset(storedToks, typedToks))
    ) {
      hits.push({
        type,
        matchScore: 0.8,
        matchedAgainst: storedDisplay,
        record,
      });
    }
  };

  for (const r of data.records) {
    // typed opposing vs stored client + aliases  (CRITICAL — this is the
    // textbook conflict: someone retaining us against a former client)
    testPair(
      opposingKey,
      opposingToks,
      r.clientKey,
      r.clientName,
      "opposing-is-stored-client",
      r
    );
    for (let i = 0; i < r.clientAliasKeys.length; i++) {
      testPair(
        opposingKey,
        opposingToks,
        r.clientAliasKeys[i],
        r.clientAliases[i],
        "opposing-is-stored-client-alias",
        r
      );
    }

    // typed client vs stored client + aliases  (likely repeat client; flag for
    // awareness so the lawyer can decide whether to take a related matter)
    testPair(
      clientKey,
      clientToks,
      r.clientKey,
      r.clientName,
      "client-is-stored-client",
      r
    );
    for (let i = 0; i < r.clientAliasKeys.length; i++) {
      testPair(
        clientKey,
        clientToks,
        r.clientAliasKeys[i],
        r.clientAliases[i],
        "client-is-stored-client-alias",
        r
      );
    }

    // typed client vs stored opposing  (unusual — possible role reversal)
    for (let i = 0; i < r.opposingKeys.length; i++) {
      testPair(
        clientKey,
        clientToks,
        r.opposingKeys[i],
        r.opposingNames[i],
        "client-was-stored-opposing",
        r
      );
    }

    // typed opposing vs stored opposing  (minor — informational)
    for (let i = 0; i < r.opposingKeys.length; i++) {
      testPair(
        opposingKey,
        opposingToks,
        r.opposingKeys[i],
        r.opposingNames[i],
        "opposing-was-stored-opposing",
        r
      );
    }
  }

  // Dedupe (a single record can match across multiple typed fields). Keep the
  // highest-priority + highest-score hit per (record, type).
  const dedupedMap = new Map<string, ConflictHit>();
  const priority = (t: ConflictMatchType): number => {
    if (t === "opposing-is-stored-client" || t === "opposing-is-stored-client-alias") return 0;
    if (t === "client-was-stored-opposing") return 1;
    if (t === "client-is-stored-client" || t === "client-is-stored-client-alias") return 2;
    return 3;
  };
  for (const hit of hits) {
    const key = `${hit.record.clientKey}|${hit.record.fileNo}|${hit.type}`;
    const existing = dedupedMap.get(key);
    if (!existing || hit.matchScore > existing.matchScore) {
      dedupedMap.set(key, hit);
    }
  }
  const sorted = [...dedupedMap.values()].sort((a, b) => {
    const p = priority(a.type) - priority(b.type);
    if (p !== 0) return p;
    return b.matchScore - a.matchScore;
  });

  return { hits: sorted, totalRecords: data.records.length, hadDataset: true };
}

export function describeMatchType(t: ConflictMatchType): string {
  switch (t) {
    case "opposing-is-stored-client":
      return "Opposing party was a former client";
    case "opposing-is-stored-client-alias":
      return "Opposing party matches a former client's alias";
    case "client-is-stored-client":
      return "Client name matches a former client";
    case "client-is-stored-client-alias":
      return "Client name matches a former client's alias";
    case "client-was-stored-opposing":
      return "Client name appears as a former opposing party";
    case "opposing-was-stored-opposing":
      return "Opposing party appears as a former opposing party";
  }
}

/** Build the "⚠️ POSSIBLE CONFLICT" block for the firm-side email body. */
export function formatConflictAlert(
  input: ConflictCheckInput,
  result: ConflictCheckResult
): string | null {
  if (!result.hadDataset || result.hits.length === 0) return null;

  const lines: string[] = [];
  lines.push(
    `⚠️ POSSIBLE CONFLICT — ${result.hits.length} match${result.hits.length === 1 ? "" : "es"} in the conflict database`
  );
  lines.push("");
  lines.push("Searched:");
  lines.push(`  Client:   ${input.clientName || "(not provided)"}`);
  lines.push(`  Opposing: ${input.opposingName || "(not provided)"}`);
  lines.push("");
  lines.push("Matches (highest priority first):");

  const SHOW = 12;
  for (const hit of result.hits.slice(0, SHOW)) {
    const score = hit.matchScore === 1 ? "exact" : "partial";
    const date =
      hit.record.dateLabel ?? hit.record.date ?? "(date unknown)";
    const file = hit.record.fileNo || "(no file no.)";
    const lawyer = hit.record.lawyer || "(lawyer unknown)";
    lines.push(`  • [${describeMatchType(hit.type)} — ${score}]`);
    lines.push(
      `      matched "${hit.matchedAgainst}" — file ${file}, ${lawyer}, ${date}`
    );
  }
  if (result.hits.length > SHOW) {
    lines.push(`  ... and ${result.hits.length - SHOW} more`);
  }
  lines.push("");
  lines.push(`(Conflict database: ${result.totalRecords} records loaded.)`);
  return lines.join("\n");
}

/** True if at least one hit indicates a likely real conflict (not just a coincidence). */
export function isLikelyConflict(result: ConflictCheckResult): boolean {
  return result.hits.some(
    (h) =>
      h.type === "opposing-is-stored-client" ||
      h.type === "opposing-is-stored-client-alias" ||
      h.type === "client-was-stored-opposing"
  );
}
