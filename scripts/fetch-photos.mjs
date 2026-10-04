// Downloads every site photo from Unsplash into docs/assets/photos/
// under keyword file names (3 sizes, WebP) plus social-share JPGs.
// Needs Node 18+ and internet. No other dependencies.
//   npm run photos && npm run build
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { photos } from "../src/data/photos.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "docs/assets/photos");
fs.mkdirSync(path.join(DIR, "og"), { recursive: true });

async function get(url, file) {
  if (fs.existsSync(file)) return "skip";
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  return "ok";
}
let n = 0;
for (const [key, p] of Object.entries(photos)) {
  for (const w of [800, 1200, 1600]) {
    await get(`${p.raw}?w=${w}&h=${Math.round(w * 0.625)}&fit=crop&crop=entropy&fm=webp&q=78`, path.join(DIR, `${p.file}-${w}.webp`)); n++;
  }
  await get(`${p.raw}?w=1200&h=630&fit=crop&crop=entropy&fm=jpg&q=80`, path.join(DIR, "og", `${p.file}.jpg`)); n++;
  process.stdout.write(`✓ ${p.file}\n`);
}
console.log(`\n${n} files in docs/assets/photos — now run: npm run build`);
