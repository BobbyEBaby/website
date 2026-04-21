import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const DIR = new URL("../public/lawyers/", import.meta.url).pathname.replace(
  /^\/([A-Za-z]):/,
  "$1:"
);

const MAX_WIDTH = 1600;
const QUALITY = 82;

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));

let before = 0;
let after = 0;

for (const file of files) {
  const src = join(DIR, file);
  const tmp = join(DIR, `.tmp-${file}`);
  const s1 = (await stat(src)).size;
  before += s1;

  await sharp(src)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .withMetadata({ exif: undefined })
    .toFile(tmp);

  await unlink(src);
  await rename(tmp, src);

  const s2 = (await stat(src)).size;
  after += s2;
  const pct = (((s1 - s2) / s1) * 100).toFixed(1);
  console.log(
    `${file.padEnd(28)}  ${(s1 / 1024 / 1024).toFixed(1).padStart(5)} MB → ${(
      s2 /
      1024 /
      1024
    )
      .toFixed(2)
      .padStart(5)} MB  (-${pct}%)`
  );
}

console.log(
  `\nTotal: ${(before / 1024 / 1024).toFixed(1)} MB → ${(
    after /
    1024 /
    1024
  ).toFixed(1)} MB  (-${(((before - after) / before) * 100).toFixed(1)}%)`
);
