// Renders every site image from the Angir illustration system.
// Needs `sharp`:  npm install  →  npm run images
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { motifSVG, placeSVG, ogSVG, logoSVG } from "./art.mjs";
import { servicesA } from "./data/services-a.mjs";
import { servicesB } from "./data/services-b.mjs";
import { servicesC } from "./data/services-c.mjs";
import { locations } from "./data/locations.mjs";
import { guides } from "./data/guides.mjs";

const require = createRequire(import.meta.url);
let sharp; try { sharp = require("sharp"); } catch { sharp = createRequire(process.env.SHARP_FROM || "/opt/npm-tools/node_modules/")("sharp"); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "docs/assets");
const services = [...servicesA, ...servicesB, ...servicesC];
fs.mkdirSync(path.join(OUT, "img"), { recursive: true });
fs.mkdirSync(path.join(OUT, "og"), { recursive: true });
fs.mkdirSync(path.join(OUT, "brand"), { recursive: true });

async function img(name, svg) {
  const buf = Buffer.from(svg);
  const base = path.join(OUT, "img", name);
  await sharp(buf).webp({ quality: 82 }).toFile(base + ".webp");
  await sharp(buf).resize(1200).webp({ quality: 80 }).toFile(base + "-1200.webp");
  await sharp(buf).resize(800).webp({ quality: 78 }).toFile(base + "-800.webp");
}
async function og(name, artSvg, title, kicker) {
  await sharp(Buffer.from(ogSVG(artSvg, title, kicker))).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(OUT, "og", name + ".jpg"));
}

let count = 0;
for (const s of services) {
  const art = motifSVG(s.art, s.slug);
  await img(`${s.slug}-brooklyn-nyc`, art);
  await og(s.slug, art, s.name, "Brooklyn & NYC"); count += 4;
}
for (const l of locations) {
  const art = placeSVG(l.slug, l.name);
  await img(`welding-fabrication-${l.slug}${l.borough_page ? "" : "-brooklyn"}`, art);
  await og(`area-${l.slug}`, art, `Welding & ironwork in ${l.name}`, l.borough_page ? "New York City" : "Brooklyn, NY"); count += 4;
}
for (const g of guides) {
  const art = motifSVG(g.art, g.slug);
  await img(g.slug, art);
  await og(`guide-${g.slug}`, art, g.h1, "Angir guide"); count += 4;
}
const pages = {
  "brooklyn-welding-fabrication-hero": "hero",
  "custom-railing-measurements-brooklyn": "measure",
  "angir-welding-shop-dyker-heights-brooklyn": "workshop",
  "mobile-welding-truck-brooklyn": "truck",
};
for (const [name, key] of Object.entries(pages)) { await img(name, motifSVG(key, name)); count += 3; }
const hero = motifSVG("hero", "brooklyn-welding-fabrication-hero");
for (const [k, t, kk] of [["home", "Brooklyn welding & fabrication, built right", "Dyker Heights · Brooklyn"], ["services", "Every kind of metal work, one shop", "Services"], ["areas", "Welding & ironwork across NYC", "Service area"], ["guides", "Straight answers about NYC metal work", "Guides"], ["faq", "Welding & ironwork questions, answered", "FAQ"], ["contact", "Get a quote in minutes", "Contact"], ["about", "A Brooklyn shop that builds and installs", "About"]]) {
  await og(k, k === "about" ? motifSVG("workshop", "angir-welding-shop-dyker-heights-brooklyn") : hero, t, kk); count++;
}
// brand
const mark = logoSVG(512);
fs.writeFileSync(path.join(OUT, "brand/logo-mark.svg"), mark);
for (const sz of [512, 192]) await sharp(Buffer.from(mark)).resize(sz).png().toFile(path.join(OUT, `brand/logo-${sz}.png`));
await sharp(Buffer.from(mark)).resize(180).png().toFile(path.join(OUT, "brand/apple-touch-icon.png"));
// favicon.ico (PNG-in-ICO, 32px)
const png32 = await sharp(Buffer.from(mark)).resize(32).png().toBuffer();
const head = Buffer.alloc(22); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9); head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(png32.length, 14); head.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(ROOT, "docs/favicon.ico"), Buffer.concat([head, png32]));
console.log(`Rendered ${count} images + brand set → docs/assets`);
