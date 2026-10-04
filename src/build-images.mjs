// Renders the logo, favicon and app icons (needs `sharp`: npm install).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { logoSVG } from "./art.mjs";
const require = createRequire(import.meta.url);
let sharp; try { sharp = require("sharp"); } catch { sharp = createRequire("/opt/npm-tools/node_modules/")("sharp"); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "docs/assets/brand");
fs.mkdirSync(OUT, { recursive: true });
const mark = logoSVG(512);
fs.writeFileSync(path.join(OUT, "logo-mark.svg"), mark);
for (const sz of [512, 192]) await sharp(Buffer.from(mark)).resize(sz).png().toFile(path.join(OUT, `logo-${sz}.png`));
await sharp(Buffer.from(mark)).resize(180).png().toFile(path.join(OUT, "apple-touch-icon.png"));
const png32 = await sharp(Buffer.from(mark)).resize(32).png().toBuffer();
const head = Buffer.alloc(22); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4); head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(png32.length, 14); head.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(ROOT, "docs/favicon.ico"), Buffer.concat([head, png32]));
console.log("Brand icons written.");
