// ─────────────────────────────────────────────────────────────
//  Angir Welding & Fabrication — static site builder
//  `node src/build.mjs` → writes the whole site into /docs
//  No dependencies. Images are built separately (src/build-images.mjs).
// ─────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "./data/site.mjs";
import { servicesA } from "./data/services-a.mjs";
import { servicesB } from "./data/services-b.mjs";
import { servicesC } from "./data/services-c.mjs";
import { locations } from "./data/locations.mjs";
import { guides, faqs } from "./data/guides.mjs";
import { photos } from "./data/photos.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "docs");
const YEAR = new Date().getFullYear();

export const services = [...servicesA, ...servicesB, ...servicesC];
export const GROUPS = [
  { id: "stairs", name: "Stairs & Railings", kicker: "01", blurb: "Staircases, railings and handrails — indoors, on the stoop and up on the roof." },
  { id: "gates", name: "Gates, Fences & Security", kicker: "02", blurb: "Driveway gates, fences, window guards and security doors that look as good as they protect." },
  { id: "building", name: "Building & Structural", kicker: "03", blurb: "Fire escapes, beams, lintels, ladders and the steel that NYC buildings depend on." },
  { id: "commercial", name: "Commercial & Storefront", kicker: "04", blurb: "Rolling gates, stainless kitchens and protective steel for Brooklyn businesses." },
  { id: "fabrication", name: "Custom Fabrication", kicker: "05", blurb: "Ornamental iron, furniture, one-off parts and restoration — built from your sketch." },
  { id: "repair", name: "Welding & Repair", kicker: "06", blurb: "Shop and mobile welding for anything metal that broke — steel, stainless, aluminum, cast iron." },
];
const svc = Object.fromEntries(services.map((s) => [s.slug, s]));
const loc = Object.fromEntries(locations.map((l) => [l.slug, l]));
const brooklyn = locations.filter((l) => l.borough === "Brooklyn");
const boroughs = locations.filter((l) => l.borough_page);

// ── image paths (keyword-named; produced by build-images.mjs)
export const IMG = {
  service: (s) => `/assets/img/${s.slug}-brooklyn-nyc`,
  area: (l) => `/assets/img/welding-fabrication-${l.slug}${l.borough_page ? "" : "-brooklyn"}`,
  guide: (g) => `/assets/img/${g.slug}`,
  page: (k) => `/assets/img/${k}`,
  og: (k) => `/assets/og/${k}.jpg`,
};
export const ALT = {
  stairs: "steel staircase with a red handrail being welded", spiral: "steel spiral staircase with red helical handrail",
  railing: "interior stair railing with flat-bar pickets and red handrail", stoop: "brownstone stoop with iron railing and scroll newel",
  balcony: "balcony guardrail on a brick building", glassrail: "stainless steel posts with glass railing panels",
  handrail: "accessible ramp handrails with returns", gate: "arched wrought iron driveway gate between brick pillars",
  slidegate: "cantilever sliding gate with gate operator", fence: "wrought iron picket fence in front of a house",
  windowguard: "custom iron window guards on a brick wall", door: "steel security door with diamond lattice",
  fireescape: "NYC fire escape with landings, stairs and drop ladder", beam: "steel I-beam and columns for a renovation",
  lintel: "new steel lintel above a window in a brick wall", cellar: "diamond-plate sidewalk cellar doors",
  canopy: "steel pergola and canopy frame", ladder: "roof access ladder with gooseneck and safety cage",
  mezzanine: "steel storage mezzanine with stair and guardrail", treeguard: "steel tree guard around a street tree",
  rollgate: "storefront rolling gate with perforated slats", kitchen: "stainless steel restaurant work table and shelving",
  bollard: "concrete-filled steel bollards in front of a storefront", fabrication: "custom steel bracket on a fabrication bench",
  ornamental: "ornamental iron panel with scrolls and rosette", furniture: "steel table base and shelving unit",
  paint: "iron railing being restored from rust and repainted", torch: "MIG welding torch laying a bead with sparks",
  truck: "Angir mobile welding truck", sparks: "emergency welding repair of a cracked steel plate",
  gaterepair: "iron gate repaired with a new diagonal brace", aluminum: "aluminum boat T-top being TIG welded",
  stainless: "stainless steel tube joint with TIG weld bead", castiron: "cracked cast iron ornament being brazed",
  trailer: "utility trailer tongue being welded", hero: "wrought iron gate in front of Brooklyn row houses with the Verrazzano Bridge",
  workshop: "Angir Welding & Fabrication shop in Dyker Heights, Brooklyn", measure: "railing drawing with field measurements",
};

// ── helpers
const esc = (t = "") => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => site.url + p;
const tel = `tel:${site.phoneHref}`;
const addr = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.zip}`;
const PH = (key) => { const p = photos[key]; if (!p) throw new Error("No photo for " + key); return p; };
const isLocal = (p) => fs.existsSync(path.join(OUT, "assets/photos", p.file + "-1600.webp"));
const phUrl = (p, w, h = Math.round(w * 0.625)) => isLocal(p) ? `/assets/photos/${p.file}-${w}.webp` : `${p.raw}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=75`;
const ogUrl = (key) => { const p = PH(key); return fs.existsSync(path.join(OUT, "assets/photos/og", p.file + ".jpg")) ? abs(`/assets/photos/og/${p.file}.jpg`) : `${p.raw}?w=1200&h=630&fit=crop&crop=entropy&fm=jpg&q=80`; };
const pic = (key, alt, { eager = false, cls = "", sizes = "(max-width: 900px) 100vw, 50vw" } = {}) => {
  const p = PH(key);
  return `<img class="${cls}" src="${phUrl(p, 1200)}" srcset="${phUrl(p, 800)} 800w, ${phUrl(p, 1200)} 1200w, ${phUrl(p, 1600)} 1600w" sizes="${sizes}" width="1600" height="1000" alt="${esc(alt || p.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
};
const stars = `<span class="stars" aria-hidden="true">★★★★★</span>`;

const ICON = {
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="10" r="2.6" fill="currentColor"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  // process icons
  text: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="12" y="4" width="24" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="17" y="12" width="14" height="10" rx="1.5" fill="currentColor" opacity=".25"/><path d="M17 28h14M17 33h9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  tape: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="20" cy="22" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="20" cy="22" r="4" fill="currentColor"/><path d="M20 36h24v-6H30" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M36 36v-3M40 36v-3" stroke="currentColor" stroke-width="2"/></svg>`,
  draw: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="8" width="36" height="32" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 32V18M12 18h24M18 18v14M24 18v14M30 18v14M36 18v14" stroke="currentColor" stroke-width="2"/><path d="M10 14h28" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3"/></svg>`,
  weld: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 38h36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M14 34l12-16 10-6" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="14" cy="34" r="3.5" fill="currentColor"/><path d="M8 26l-3-3M14 24v-5M20 27l3-3M9 32H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  finish: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="6" width="22" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M30 12h6v10H19v6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><rect x="15" y="28" width="8" height="14" rx="2" fill="currentColor"/></svg>`,
  install: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 42h36M10 42V14h28v28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 20h28M16 20v22M22 20v22M28 20v22M34 20v22" stroke="currentColor" stroke-width="2"/><path d="M30 8l4 4 8-8" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const STEPS = [
  { icon: "text", h: "Call or text photos", p: "Send a few photos and rough measurements. Most jobs get a price range the same day." },
  { icon: "tape", h: "We measure on site", p: "We laser-measure and template the real opening, stair or wall — Brooklyn buildings are never square." },
  { icon: "draw", h: "Drawing & fixed quote", p: "You approve a simple drawing, material and finish before any steel is cut. No surprises." },
  { icon: "weld", h: "Built in our shop", p: "Cut, fit and welded in our Dyker Heights shop by the same crew that installs it." },
  { icon: "finish", h: "Finished to last", p: "Primer and industrial paint, powder coat or hot-dip galvanizing — chosen for NYC weather." },
  { icon: "install", h: "Install & walkthrough", p: "Clean, fast install. We check every weld, latch and anchor with you before we leave." },
];

// ─────────────────────────────────────────────────────────────
//  Layout
// ─────────────────────────────────────────────────────────────
function orgSchema() {
  const o = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": site.url + "/#business",
    name: site.name,
    legalName: site.legalName,
    url: site.url + "/",
    logo: abs("/assets/brand/logo-512.png"),
    image: [abs("/assets/og/home.jpg")],
    telephone: site.phoneHref,
    email: site.email,
    description: "Brooklyn welding and metal fabrication shop: custom railings, gates, fences, metal stairs, fire escape repair, rolling gates, structural steel and mobile welding across NYC.",
    address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.zip, addressCountry: "US" },
    geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
    hasMap: site.googleProfile,
    areaServed: [...locations.map((l) => ({ "@type": l.borough_page ? "AdministrativeArea" : "Place", name: l.borough_page ? `${l.name}, NY` : `${l.name}, Brooklyn, NY` })), { "@type": "City", name: "New York" }],
    knowsAbout: ["Welding", "Metal fabrication", "MIG welding", "TIG welding", "Stick welding", "Ornamental iron", "Structural steel", "Fire escape repair", "Rolling gate repair"],
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Welding & fabrication services",
      itemListElement: GROUPS.map((g) => ({ "@type": "OfferCatalog", name: g.name, itemListElement: services.filter((s) => s.group === g.id).map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: abs(`/services/${s.slug}/`) } })) })),
    },
    sameAs: [site.googleProfile, ...Object.values(site.social).filter(Boolean)],
  };
  if (site.hours.length) o.openingHoursSpecification = site.hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.d, opens: h.open, closes: h.close }));
  return o;
}
const crumbs = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(url) })) });
const faqSchema = (list) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

function header(active) {
  const megaCols = GROUPS.map((g) => `<div class="mega-col"><p class="mega-h">${esc(g.name)}</p><ul>${services.filter((s) => s.group === g.id).map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join("")}</ul></div>`).join("");
  const nav = [["Services", "/services/"], ["Areas", "/areas/"], ["Guides", "/guides/"], ["About", "/about/"], ["FAQ", "/faq/"], ["Contact", "/contact/"]];
  return `<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap topbar-in"><span>${ICON.pin} ${esc(site.address.street)}, ${esc(site.address.neighborhood)}, Brooklyn</span><span class="hide-sm">Shop &amp; mobile welding · Brooklyn · Staten Island · Queens · Manhattan</span><a href="${tel}">${ICON.phone} ${esc(site.phoneDisplay)}</a></div></div>
<header class="site-header" id="top">
  <div class="wrap header-in">
    <a class="brand" href="/" aria-label="${esc(site.name)} home"><img src="/assets/brand/logo-mark.svg" width="40" height="40" alt=""><span class="brand-t"><b>Angir</b><small>Welding &amp; Fabrication</small></span></a>
    <nav class="nav" aria-label="Main">
      <ul>
        <li class="has-mega"><a href="/services/" ${active === "services" ? 'aria-current="page"' : ""}>Services</a><div class="mega"><div class="wrap mega-in">${megaCols}</div></div></li>
        ${nav.slice(1).map(([t, u]) => `<li><a href="${u}" ${active === t.toLowerCase() ? 'aria-current="page"' : ""}>${t}</a></li>`).join("")}
      </ul>
    </nav>
    <div class="header-cta"><a class="btn btn-ghost hide-md" href="/contact/">Get a quote</a><a class="btn btn-red" href="${tel}">${ICON.phone}<span>${esc(site.phoneDisplay)}</span></a>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">${ICON.menu}</button></div>
  </div>
</header>
<div class="drawer" id="drawer" hidden>
  <div class="drawer-in">
    <button class="drawer-close" aria-label="Close menu">${ICON.close}</button>
    <a class="drawer-call btn btn-red btn-lg" href="${tel}">${ICON.phone} Call ${esc(site.phoneDisplay)}</a>
    ${GROUPS.map((g) => `<details><summary>${esc(g.name)}</summary><ul>${services.filter((s) => s.group === g.id).map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join("")}</ul></details>`).join("")}
    <ul class="drawer-links">${nav.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join("")}</ul>
  </div>
</div>`;
}

function footer() {
  const col = (h, items) => `<div class="f-col"><p class="f-h">${h}</p><ul>${items.map(([t, u]) => `<li><a href="${u}">${esc(t)}</a></li>`).join("")}</ul></div>`;
  const social = Object.entries(site.social).filter(([, v]) => v);
  return `<section class="cta-band"><div class="wrap cta-in">
  <div><p class="kicker light">Brooklyn welding &amp; fabrication</p><h2>Metal that needs <em>building or fixing?</em></h2><p class="cta-sub">Call or text photos — we'll tell you what it takes, straight.</p></div>
  <div class="cta-btns"><a class="btn btn-white btn-lg" href="${tel}">${ICON.phone} ${esc(site.phoneDisplay)}</a><a class="btn btn-outline-light btn-lg" href="/contact/">Request a quote ${ICON.arrow}</a></div>
</div></section>
<footer class="site-footer">
  <div class="wrap">
    <div class="f-top">
      <div class="f-brand"><a class="brand brand-light" href="/"><img src="/assets/brand/logo-mark.svg" width="44" height="44" alt=""><span class="brand-t"><b>Angir</b><small>Welding &amp; Fabrication</small></span></a>
        <p>Custom railings, gates, stairs, fire escape repair, storefront gates, structural steel and mobile welding — built in our Brooklyn shop by the people who install it.</p>
        <ul class="f-contact"><li>${ICON.phone}<a href="${tel}">${esc(site.phoneDisplay)}</a></li><li>${ICON.mail}<a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li><li>${ICON.pin}<a href="${esc(site.googleProfile)}" rel="noopener" target="_blank">${esc(addr)}</a></li></ul>
        <a class="g-badge" href="${esc(site.googleProfile)}" target="_blank" rel="noopener">${stars}<span><b>${site.googleRating}</b> on Google</span></a>
      </div>
      ${GROUPS.slice(0, 3).map((g) => col(g.name, services.filter((s) => s.group === g.id).map((s) => [s.name, `/services/${s.slug}/`]))).join("")}
    </div>
    <div class="f-mid">
      ${GROUPS.slice(3).map((g) => col(g.name, services.filter((s) => s.group === g.id).map((s) => [s.name, `/services/${s.slug}/`]))).join("")}
      ${col("Brooklyn", brooklyn.slice(0, 16).map((l) => [l.name, `/areas/${l.slug}/`]))}
      ${col("More areas", [...brooklyn.slice(16).map((l) => [l.name, `/areas/${l.slug}/`]), ...boroughs.map((l) => [l.name, `/areas/${l.slug}/`])])}
      ${col("Company", [["About", "/about/"], ["Guides", "/guides/"], ["FAQ", "/faq/"], ["Contact", "/contact/"], ["Service areas", "/areas/"], ["All services", "/services/"], ...social.map(([k, v]) => [k[0].toUpperCase() + k.slice(1), v])])}
    </div>
    <div class="f-bottom"><p>© ${YEAR} ${esc(site.legalName)} · ${esc(addr)}${site.licensedInsured ? " · Licensed &amp; insured" : ""}${site.licenseNumber ? ` · License #${esc(site.licenseNumber)}` : ""}</p><p><a href="/privacy/">Privacy</a> · <a href="/credits/">Photo credits</a> · <a href="/sitemap.xml">Sitemap</a></p></div>
  </div>
</footer>
<div class="mobile-bar"><a class="btn btn-red" href="${tel}">${ICON.phone} Call now</a><a class="btn btn-dark" href="/contact/">Free quote</a></div>`;
}

function page({ url, title, desc, body, active = "", og = "page:hero", schema = [], type = "website" }) {
  const sc = [orgSchema(), ...schema].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${abs(url)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#8d0d0c">
<meta name="geo.region" content="US-NY"><meta name="geo.placename" content="Brooklyn"><meta name="geo.position" content="${site.address.lat};${site.address.lng}"><meta name="ICBM" content="${site.address.lat}, ${site.address.lng}">
<meta property="og:type" content="${type}"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${abs(url)}"><meta property="og:image" content="${ogUrl(og)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${ogUrl(og)}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/assets/brand/logo-mark.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700;1,800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css?v=${BUILD_V}">
${sc}
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/site.js?v=${BUILD_V}" defer></script>
</body>
</html>`;
}
const BUILD_V = Date.now().toString(36);

// ─────────────────────────────────────────────────────────────
//  Reusable blocks
// ─────────────────────────────────────────────────────────────
const crumbHtml = (items) => `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${items.map(([t, u], i) => i === items.length - 1 ? `<li aria-current="page">${esc(t)}</li>` : `<li><a href="${u}">${esc(t)}</a></li>`).join("")}</ol></nav>`;

const card = (s, h = "h3") => `<a class="card" href="/services/${s.slug}/"><div class="card-img">${pic(s.slug, `${PH(s.slug).alt} — ${s.name.toLowerCase()} in Brooklyn`, { sizes: "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" })}</div><div class="card-b"><${h}>${esc(s.name)}</${h}><p>${esc(s.card)}</p><span class="more">Learn more ${ICON.arrow}</span></div></a>`;

const faqList = (list) => `<div class="faq-list">${list.map((f, i) => `<details ${i === 0 ? "open" : ""}><summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`).join("")}</div>`;

const method = (dark = true) => `<section class="method ${dark ? "dark" : ""}"><div class="wrap">
  <div class="sec-head"><p class="kicker ${dark ? "light" : ""}">The Angir method</p><h2>From photo to <em>finished steel.</em></h2><p class="sec-sub">Six steps, one shop, one crew. You always know what's happening and what it costs.</p></div>
  <ol class="steps">${STEPS.map((s, i) => `<li><span class="step-n">${String(i + 1).padStart(2, "0")}</span><span class="step-i">${ICON[s.icon]}</span><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></li>`).join("")}</ol>
</div></section>`;

const quoteForm = (context = "") => `<form class="quote" data-endpoint="${esc(site.formEndpoint)}" data-email="${esc(site.email)}" novalidate>
  <p class="quote-h">Get a free quote</p>
  <p class="quote-sub">Photos help — text them to <a href="sms:${site.phoneHref}">${esc(site.phoneDisplay)}</a>.</p>
  <input type="hidden" name="service" value="${esc(context)}">
  <label>Name<input name="name" autocomplete="name" required></label>
  <label>Phone<input name="phone" type="tel" autocomplete="tel" required></label>
  <label>Email<input name="email" type="email" autocomplete="email"></label>
  <label>Neighborhood or address<input name="address" autocomplete="street-address"></label>
  <label>What do you need?<textarea name="message" rows="3" placeholder="${context ? esc(context + " — ") : ""}size, location, timing…"></textarea></label>
  <div class="seg" role="radiogroup" aria-label="Property type"><label><input type="radio" name="type" value="Residential" checked><span>Residential</span></label><label><input type="radio" name="type" value="Commercial"><span>Commercial</span></label></div>
  <button class="btn btn-red btn-block" type="submit">Request quote ${ICON.arrow}</button>
  <p class="form-note" role="status"></p>
</form>`;

const areaChips = (list) => `<ul class="chips">${list.map((l) => `<li><a href="/areas/${l.slug}/">${esc(l.name)}</a></li>`).join("")}</ul>`;

// ─────────────────────────────────────────────────────────────
//  PAGES
// ─────────────────────────────────────────────────────────────
const pages = [];
const add = (url, html) => pages.push([url, html]);

// ── HOME
{
  const groupsHtml = GROUPS.map((g) => {
    const list = services.filter((s) => s.group === g.id);
    return `<div class="svc-group" id="${g.id}"><div class="svc-group-head"><span class="phase">${g.kicker}</span><div><h3>${esc(g.name)}</h3><p>${esc(g.blurb)}</p></div><a class="link" href="/services/#${g.id}">All ${list.length} ${ICON.arrow}</a></div>
    <div class="grid cards">${list.slice(0, 3).map((s) => card(s, "h4")).join("")}</div>
    <ul class="mini-links">${list.slice(3).map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join("")}</ul></div>`;
  }).join("");

  const body = `
<section class="hero">
  <div class="hero-media">${pic("page:hero", "Welder welding steel — Angir Welding & Fabrication, Brooklyn", { eager: true, sizes: "100vw" })}</div>
  <div class="wrap hero-in">
    <p class="kicker light">Welding &amp; metal fabrication · Brooklyn, NY</p>
    <h1>Brooklyn welding &amp; fabrication, <em>built right.</em></h1>
    <p class="hero-sub">Custom railings, gates, fences, stairs, fire escape repair, rolling gates and structural steel — fabricated in our Dyker Heights shop and installed across NYC. Mobile welding when it can't come to us.</p>
    <div class="hero-cta"><a class="btn btn-red btn-lg" href="${tel}">${ICON.phone} Call ${esc(site.phoneDisplay)}</a><a class="btn btn-outline-light btn-lg" href="/services/">View services ${ICON.arrow}</a></div>
    <a class="hero-rating" href="${esc(site.googleProfile)}" target="_blank" rel="noopener">${stars}<span><b>${site.googleRating}/5</b> on Google</span></a>
  </div>
</section>

<section class="proof"><div class="wrap proof-in">
  <div><b>Brooklyn shop</b><span>81st St, Dyker Heights</span></div>
  <div><b>Mobile rig</b><span>Self-powered, on-site welding</span></div>
  <div><b>MIG · TIG · Stick</b><span>Steel, stainless, aluminum, cast iron</span></div>
  <div><b>One crew</b><span>Builds it and installs it</span></div>
</div></section>

<section class="why"><div class="wrap">
  <div class="sec-head"><p class="kicker">Why Angir</p><h2>Metal work you only <em>pay for once.</em></h2></div>
  <div class="grid three pillars">
    <article><span class="pillar-n">01</span><h3>Measured, not guessed</h3><p>Brooklyn buildings settle, lean and wind. We measure and template every job on site so railings, gates and stairs fit the building you actually have — not a catalog size.</p></article>
    <article><span class="pillar-n">02</span><h3>Welds you can trust</h3><p>The right process for the metal — MIG for structural steel, TIG for stainless and aluminum, stick for heavy outdoor repairs — finished clean and coated to survive NYC winters and salt.</p></article>
    <article><span class="pillar-n">03</span><h3>Straight answers</h3><p>Repair or replace? Permit or not? We'll tell you honestly, quote in writing before steel is cut, and stand behind the work.</p></article>
  </div>
</div></section>

<section class="services-home"><div class="wrap">
  <div class="sec-head"><p class="kicker">Services</p><h2>Everything metal. <em>One shop.</em></h2><p class="sec-sub">${services.length} services across six specialties — from a broken gate hinge to a full steel staircase.</p></div>
  ${groupsHtml}
</div></section>

<section class="split"><div class="wrap split-in">
  <div class="split-img">${pic("page:split", "Metal worker grinding a steel beam — custom metal fabrication in Brooklyn")}</div>
  <div class="split-txt"><p class="kicker">Built for Brooklyn</p><h2>Designed for old buildings and <em>real weather.</em></h2>
    <ul class="ticks">
      <li>${ICON.check}<span><b>Code-height railings and guards</b> designed to NYC Building Code, with tight picket spacing.</span></li>
      <li>${ICON.check}<span><b>Masonry anchoring done right</b> — core-drilled or plated posts so stoop railings don't rot out at the base.</span></li>
      <li>${ICON.check}<span><b>Outdoor finishes that last</b>: hot-dip galvanizing, zinc-rich primer, industrial enamel or powder coat.</span></li>
      <li>${ICON.check}<span><b>Fire-safety aware</b>: fire-escape window gates, egress-friendly guards and FISP repair scopes.</span></li>
      <li>${ICON.check}<span><b>Historic details matched</b> — pickets, scrolls and castings copied so repairs disappear.</span></li>
    </ul>
    <a class="btn btn-dark" href="/guides/">Read our NYC guides ${ICON.arrow}</a>
  </div>
</div></section>

${method(true)}

<section class="reviews"><div class="wrap reviews-in">
  <div><p class="kicker">Reviews</p><h2>Rated <em>${site.googleRating} on Google.</em></h2><p class="sec-sub">We're a growing local shop and every review matters. Read what customers say — and if we've done work for you, we'd be grateful for yours.</p>
    <div class="btn-row"><a class="btn btn-dark" href="${esc(site.googleProfile)}" target="_blank" rel="noopener">Read our Google reviews ${ICON.arrow}</a><a class="btn btn-ghost" href="${esc(site.googleProfile)}" target="_blank" rel="noopener">Leave a review</a></div></div>
  <div class="g-card"><div class="g-score">${site.googleRating}</div>${stars}<p>Google rating</p><span>Angir Welding &amp; Fabrication<br>${esc(addr)}</span></div>
</div></section>

<section class="areas-home"><div class="wrap">
  <div class="sec-head"><p class="kicker">Service area</p><h2>From Dyker Heights <em>to all five boroughs.</em></h2><p class="sec-sub">Our shop is on 81st Street, so South Brooklyn gets us fastest — but we work across Brooklyn, Staten Island, Queens and Manhattan.</p></div>
  <div class="areas-grid">
    <div><h3>Brooklyn</h3>${areaChips(brooklyn)}</div>
    <div><h3>Beyond Brooklyn</h3>${areaChips(boroughs)}<a class="link" href="/areas/">See the full service area ${ICON.arrow}</a></div>
  </div>
</div></section>

<section class="faq-sec"><div class="wrap faq-in">
  <div class="sec-head left"><p class="kicker">FAQ</p><h2>Questions, <em>answered.</em></h2><a class="link" href="/faq/">All FAQs ${ICON.arrow}</a></div>
  ${faqList(faqs.slice(0, 7))}
</div></section>`;
  add("/", page({ url: "/", title: "Angir Welding & Fabrication | Brooklyn Welding & Metal Fabrication NYC", desc: "Brooklyn welding & metal fabrication shop in Dyker Heights: custom iron railings, gates, fences, metal stairs, fire escape repair, rolling gates, structural steel & mobile welding across NYC.", body, og: "page:hero", schema: [faqSchema(faqs.slice(0, 7))] }));
}

// ── SERVICES INDEX
{
  const body = `${crumbHtml([["Home", "/"], ["Services", "/services/"]])}
<section class="page-hero"><div class="wrap"><p class="kicker">Services</p><h1>Every kind of metal work, <em>under one roof.</em></h1><p class="lede">${services.length} welding and fabrication services for homes, buildings and businesses across Brooklyn and NYC. Pick a category or call — if it's metal, we probably do it.</p>
<nav class="jump" aria-label="Service categories">${GROUPS.map((g) => `<a href="#${g.id}">${esc(g.name)}</a>`).join("")}</nav></div></section>
${GROUPS.map((g, i) => `<section class="svc-index ${i % 2 ? "alt" : ""}" id="${g.id}"><div class="wrap"><div class="sec-head left"><p class="kicker">Part ${g.kicker}</p><h2>${esc(g.name)}</h2><p class="sec-sub">${esc(g.blurb)}</p></div><div class="grid cards">${services.filter((s) => s.group === g.id).map((s) => card(s)).join("")}</div></div></section>`).join("")}
${method(true)}`;
  add("/services/", page({ url: "/services/", title: "Welding & Metal Fabrication Services | Brooklyn & NYC | Angir", desc: "All welding and metal fabrication services from Angir in Brooklyn: railings, stairs, gates, fences, window guards, fire escapes, structural steel, rolling gates, stainless, mobile & emergency welding.", body, active: "services", og: "page:split", schema: [crumbs([["Home", "/"], ["Services", "/services/"]])] }));
}

// ── SERVICE PAGES
for (const s of services) {
  const url = `/services/${s.slug}/`;
  const group = GROUPS.find((g) => g.id === s.group);
  const areasFor = brooklyn.filter((l) => l.top.includes(s.slug));
  const areaList = (areasFor.length >= 6 ? areasFor : [...areasFor, ...brooklyn.filter((l) => !areasFor.includes(l))]).slice(0, 14);
  const allFaqs = [...s.faqs, faqs[3], faqs[1]];
  const body = `${crumbHtml([["Home", "/"], ["Services", "/services/"], [group.name, `/services/#${group.id}`], [s.name, url]])}
<section class="svc-hero"><div class="wrap svc-hero-in">
  <div class="svc-hero-txt">
    <p class="kicker">${esc(group.name)} · Brooklyn &amp; NYC</p>
    <h1>${esc(s.h1[0])} <em>${esc(s.h1[1])}</em></h1>
    <p class="lede">${esc(s.lede)}</p>
    <div class="hero-cta"><a class="btn btn-red btn-lg" href="${tel}">${ICON.phone} Call ${esc(site.phoneDisplay)}</a><a class="btn btn-ghost btn-lg" href="#quote">Free quote ${ICON.arrow}</a></div>
    <ul class="badges"><li>${ICON.check} Measured on site</li><li>${ICON.check} Built in our Brooklyn shop</li><li>${ICON.check} Written quote first</li></ul>
  </div>
  <div class="svc-hero-img">${pic(s.slug, `${PH(s.slug).alt} — ${s.name.toLowerCase()}, Brooklyn NY`, { eager: true })}</div>
</div></section>

<div class="wrap svc-layout">
  <article class="svc-main">
    <section class="prose">${s.intro.map((p) => `<p>${esc(p)}</p>`).join("")}</section>

    <section><h2>What we do: ${esc(s.name.toLowerCase())}</h2>
      <div class="types">${s.types.map((t) => `<div class="type"><h3>${esc(t.h)}</h3><ul>${t.items.map((i) => `<li>${ICON.check}<span>${esc(i)}</span></li>`).join("")}</ul></div>`).join("")}</div>
    </section>

    <section><h2>Why Brooklyn chooses Angir for ${esc(s.name.toLowerCase())}</h2>
      <div class="whys">${s.why.map((w, i) => `<div class="why-c"><span>${String(i + 1).padStart(2, "0")}</span><h3>${esc(w.h)}</h3><p>${esc(w.p)}</p></div>`).join("")}</div>
    </section>

    <section class="mini-method"><h2>How it works</h2><ol>${STEPS.map((st, i) => `<li><span class="mm-i">${ICON[st.icon]}</span><div><b>${i + 1}. ${esc(st.h)}</b><p>${esc(st.p)}</p></div></li>`).join("")}</ol></section>

    <section><h2>${esc(s.name)} near you</h2><p>We install ${esc(s.name.toLowerCase())} all over Brooklyn — especially in:</p>${areaChips(areaList)}<p class="small">Also serving <a href="/areas/staten-island/">Staten Island</a>, <a href="/areas/queens/">Queens</a> and <a href="/areas/manhattan/">Manhattan</a>.</p></section>

    <section><h2>${esc(s.name)} FAQ</h2>${faqList(allFaqs)}</section>
  </article>
  <aside class="svc-aside" id="quote"><div class="sticky">${quoteForm(s.name)}
    <div class="aside-call"><p>Rather talk?</p><a href="${tel}">${ICON.phone} ${esc(site.phoneDisplay)}</a><span>Call or text — we answer late.</span></div></div></aside>
</div>

<section class="related"><div class="wrap"><div class="sec-head left"><p class="kicker">Related</p><h2>Often paired with</h2></div><div class="grid cards four">${s.related.map((r) => svc[r]).filter(Boolean).map((r) => card(r)).join("")}</div></div></section>`;
  const schema = [
    crumbs([["Home", "/"], ["Services", "/services/"], [s.name, url]]),
    { "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.name, description: s.desc, url: abs(url), image: phUrl(PH(s.slug), 1600).startsWith("/") ? abs(phUrl(PH(s.slug), 1600)) : phUrl(PH(s.slug), 1600), provider: { "@id": site.url + "/#business" }, areaServed: [{ "@type": "City", name: "Brooklyn" }, { "@type": "City", name: "New York" }], hasOfferCatalog: { "@type": "OfferCatalog", name: s.name, itemListElement: s.types.flatMap((t) => t.items).slice(0, 12).map((i) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: i } })) } },
    faqSchema(allFaqs),
  ];
  add(url, page({ url, title: s.title, desc: s.desc, body, active: "services", og: s.slug, schema }));
}

// ── AREAS INDEX
{
  const body = `${crumbHtml([["Home", "/"], ["Service areas", "/areas/"]])}
<section class="page-hero"><div class="wrap"><p class="kicker">Service area</p><h1>Welding &amp; fabrication <em>across NYC.</em></h1><p class="lede">Our shop is at ${esc(addr)} — the heart of South Brooklyn. We cover every Brooklyn neighborhood and travel to Staten Island, Queens and Manhattan for installs and mobile welding.</p></div></section>
<section class="area-index"><div class="wrap">
  <div class="map-wrap"><iframe title="Map of Angir Welding & Fabrication in Dyker Heights, Brooklyn" src="https://www.google.com/maps?q=${encodeURIComponent(addr)}&z=12&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  <h2>Brooklyn neighborhoods</h2>
  <div class="grid area-cards">${brooklyn.map((l) => `<a class="area-card" href="/areas/${l.slug}/"><div class="card-img">${pic(`area:${l.slug}`, `${PH("area:" + l.slug).alt} — welding & ironwork in ${l.name}, Brooklyn`, { sizes: "(max-width: 700px) 100vw, 25vw" })}</div><div class="card-b"><h3>${esc(l.name)}</h3><p>${esc(l.zip)} · ${l.top.slice(0, 3).map((t) => esc(svc[t].name)).join(", ")}</p></div></a>`).join("")}</div>
  <h2>Beyond Brooklyn</h2>
  <div class="grid area-cards">${boroughs.map((l) => `<a class="area-card" href="/areas/${l.slug}/"><div class="card-img">${pic(`area:${l.slug}`, `${PH("area:" + l.slug).alt} — welding & ironwork in ${l.name}, NY`, { sizes: "(max-width: 700px) 100vw, 25vw" })}</div><div class="card-b"><h3>${esc(l.name)}</h3><p>${l.top.slice(0, 3).map((t) => esc(svc[t].name)).join(", ")}</p></div></a>`).join("")}</div>
</div></section>`;
  add("/areas/", page({ url: "/areas/", title: "Service Areas | Welder in Brooklyn, Staten Island, Queens & Manhattan | Angir", desc: "Angir Welding & Fabrication serves every Brooklyn neighborhood from our Dyker Heights shop, plus Staten Island, Queens and Manhattan. Find welding and ironwork near you.", body, active: "areas", og: "area:bay-ridge", schema: [crumbs([["Home", "/"], ["Service areas", "/areas/"]])] }));
}

// ── AREA PAGES
for (const l of locations) {
  const url = `/areas/${l.slug}/`;
  const place = l.borough_page ? l.name : `${l.name}, Brooklyn`;
  const topS = l.top.map((t) => svc[t]).filter(Boolean);
  const others = services.filter((s) => !l.top.includes(s.slug));
  const near = l.near.map((n) => loc[n]).filter(Boolean);
  const localFaqs = [
    { q: `Do you serve ${l.name}?`, a: l.home ? `Yes — our shop is right here in ${l.name} at ${addr}.` : `Yes. ${l.name} is a regular service area for us. ${l.borough_page ? "" : "Our shop is in Dyker Heights, so we're a short drive away for measuring, installs and repairs."}`.trim() },
    { q: `What metal work do people in ${l.name} ask for most?`, a: `In ${l.name} we're most often called for ${topS.slice(0, 4).map((s) => s.name.toLowerCase()).join(", ")}. We handle the full range of welding and fabrication, too.` },
    { q: `Can you do mobile welding in ${l.name}?`, a: `Yes. Our self-powered mobile rig lets us weld gates, railings, fire escapes, storefront gates and equipment on site anywhere in ${l.name}.` },
    { q: "How do I get a quote?", a: `Call or text ${site.phoneDisplay} with a few photos and rough measurements, or use the quote form on this page.` },
  ];
  const body = `${crumbHtml([["Home", "/"], ["Service areas", "/areas/"], [l.name, url]])}
<section class="svc-hero"><div class="wrap svc-hero-in">
  <div class="svc-hero-txt">
    <p class="kicker">${l.borough_page ? esc(l.name) + ", NY" : esc(l.name) + " · Brooklyn " + esc(l.zip)}</p>
    <h1>Welding &amp; metal fabrication in <em>${esc(place)}.</em></h1>
    <p class="lede">${esc(l.blurb)}</p>
    <div class="hero-cta"><a class="btn btn-red btn-lg" href="${tel}">${ICON.phone} Call ${esc(site.phoneDisplay)}</a><a class="btn btn-ghost btn-lg" href="#quote">Free quote ${ICON.arrow}</a></div>
  </div>
  <div class="svc-hero-img">${pic(`area:${l.slug}`, `${PH("area:" + l.slug).alt} — welding & metal fabrication in ${place}`, { eager: true })}</div>
</div></section>

<div class="wrap svc-layout">
  <article class="svc-main">
    <section><h2>Most-requested in ${esc(l.name)}</h2><div class="grid cards two">${topS.map((s) => card(s)).join("")}</div></section>
    <section class="prose"><h2>Built for ${esc(l.name)} buildings</h2><p><b>What we see here:</b> ${esc(l.homes)}</p><p>Every job starts with measuring on site, so ironwork fits ${esc(l.name)}'s real stoops, openings and slopes. We build in our Brooklyn shop and finish outdoor steel for NYC weather${/water|salt|bay|ocean|boardwalk/i.test(l.blurb) ? " — with galvanizing or stainless recommended for salt-air exposure here" : ""}.</p></section>
    <section><h2>All services in ${esc(l.name)}</h2><ul class="svc-cols">${others.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join("")}</ul></section>
    <section><h2>Map</h2><div class="map-wrap"><iframe title="Map of ${esc(place)}" src="https://www.google.com/maps?q=${encodeURIComponent(place + ", NY")}&z=14&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></section>
    <section><h2>Nearby areas we serve</h2>${areaChips(near)}</section>
    <section><h2>${esc(l.name)} FAQ</h2>${faqList(localFaqs)}</section>
  </article>
  <aside class="svc-aside" id="quote"><div class="sticky">${quoteForm(`Job in ${l.name}`)}
    <div class="aside-call"><p>Rather talk?</p><a href="${tel}">${ICON.phone} ${esc(site.phoneDisplay)}</a><span>Call or text — we answer late.</span></div></div></aside>
</div>`;
  const title = l.borough_page ? `Welder & Metal Fabrication in ${l.name}, NY | Angir Welding` : `Welder in ${l.name}, Brooklyn | Iron Railings, Gates & Welding | Angir`;
  const desc = `Welding and metal fabrication in ${place}: ${topS.slice(0, 4).map((s) => s.name.toLowerCase()).join(", ")} and mobile welding. Brooklyn shop on 81st St — call for a free quote.`;
  add(url, page({ url, title, desc, body, active: "areas", og: `area:${l.slug}`, schema: [crumbs([["Home", "/"], ["Service areas", "/areas/"], [l.name, url]]), faqSchema(localFaqs)] }));
}

// ── GUIDES
{
  const body = `${crumbHtml([["Home", "/"], ["Guides", "/guides/"]])}
<section class="page-hero"><div class="wrap"><p class="kicker">Guides</p><h1>Straight answers about <em>NYC metal work.</em></h1><p class="lede">Railing codes, fire escape inspections, window guard rules, storefront gate laws and what really drives the price — written by a Brooklyn shop.</p></div></section>
<section><div class="wrap"><div class="grid cards">${guides.map((g) => `<a class="card" href="/guides/${g.slug}/"><div class="card-img">${pic(`guide:${g.slug}`)}</div><div class="card-b"><p class="meta">${g.read} read</p><h2 class="h3">${esc(g.h1)}</h2><p>${esc(g.desc)}</p><span class="more">Read guide ${ICON.arrow}</span></div></a>`).join("")}</div></div></section>`;
  add("/guides/", page({ url: "/guides/", title: "NYC Welding, Railing & Ironwork Guides | Angir Welding & Fabrication", desc: "Guides for NYC homeowners and businesses: railing height code, fire escape inspections, window guard law, storefront rolling gate rules, materials and pricing.", body, active: "guides", og: "guide:fire-escape-inspection-nyc", schema: [crumbs([["Home", "/"], ["Guides", "/guides/"]])] }));
}
for (const g of guides) {
  const url = `/guides/${g.slug}/`;
  const html = g.body.map(([t, v]) => t === "ul" ? `<ul>${v.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : `<${t}>${esc(v)}</${t}>`).join("\n");
  const body = `${crumbHtml([["Home", "/"], ["Guides", "/guides/"], [g.h1, url]])}
<article class="guide"><div class="wrap guide-in">
  <header class="guide-head"><p class="kicker">Guide · ${g.read} read</p><h1>${esc(g.h1)}</h1><p class="lede">${esc(g.desc)}</p></header>
  <figure class="guide-fig">${pic(`guide:${g.slug}`, null, { eager: true, sizes: "(max-width: 900px) 100vw, 900px" })}</figure>
  <div class="guide-grid"><div class="prose guide-body">${html}<p class="disclaimer">This guide is general information, not legal or engineering advice. Requirements change and depend on your building — confirm with NYC DOB, the relevant agency, or your architect/engineer.</p></div>
  <aside class="guide-aside"><div class="sticky"><p class="aside-h">Related services</p><ul>${g.services.map((sl) => svc[sl]).map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)} ${ICON.arrow}</a></li>`).join("")}</ul><a class="btn btn-red btn-block" href="${tel}">${ICON.phone} ${esc(site.phoneDisplay)}</a><a class="btn btn-ghost btn-block" href="/contact/">Request a quote</a></div></aside></div>
</div></article>`;
  const schema = [crumbs([["Home", "/"], ["Guides", "/guides/"], [g.h1, url]]), { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.desc, image: phUrl(PH(`guide:${g.slug}`), 1600).startsWith("/") ? abs(phUrl(PH(`guide:${g.slug}`), 1600)) : phUrl(PH(`guide:${g.slug}`), 1600), author: { "@type": "Organization", name: site.name, url: site.url + "/" }, publisher: { "@id": site.url + "/#business" }, mainEntityOfPage: abs(url), datePublished: "2026-10-04", dateModified: "2026-10-04" }];
  add(url, page({ url, title: g.title + " | Angir", desc: g.desc, body, active: "guides", og: `guide:${g.slug}`, type: "article", schema }));
}

// ── FAQ
{
  const svcFaqs = services.slice(0, 36).flatMap((s) => s.faqs.slice(0, 1).map((f) => ({ ...f, s })));
  const body = `${crumbHtml([["Home", "/"], ["FAQ", "/faq/"]])}
<section class="page-hero"><div class="wrap"><p class="kicker">FAQ</p><h1>Frequently asked <em>questions.</em></h1><p class="lede">Can't find your answer? Call or text ${esc(site.phoneDisplay)}.</p></div></section>
<section><div class="wrap faq-page"><h2>General</h2>${faqList(faqs)}
<h2>By service</h2>${GROUPS.map((g) => `<h3 class="faq-group">${esc(g.name)}</h3>${faqList(svcFaqs.filter((f) => f.s.group === g.id))}`).join("")}</div></section>`;
  add("/faq/", page({ url: "/faq/", title: "Welding & Ironwork FAQ | Angir Welding & Fabrication Brooklyn", desc: "Answers about custom railings, gates, stairs, fire escapes, window guards, rolling gates, pricing, permits and mobile welding in Brooklyn and NYC.", body, active: "faq", og: "welding-repair", schema: [crumbs([["Home", "/"], ["FAQ", "/faq/"]]), faqSchema([...faqs, ...svcFaqs])] }));
}

// ── ABOUT
{
  const body = `${crumbHtml([["Home", "/"], ["About", "/about/"]])}
<section class="svc-hero"><div class="wrap svc-hero-in">
  <div class="svc-hero-txt"><p class="kicker">About Angir</p><h1>A Brooklyn shop that <em>builds it and installs it.</em></h1>
  <p class="lede">Angir Welding &amp; Fabrication is a metal shop on 81st Street in Dyker Heights. We design, weld and install custom metal work for Brooklyn homes, buildings and businesses — and we fix what's broken.</p></div>
  <div class="svc-hero-img">${pic("page:about", "Welder at work in a metal shop — Angir Welding & Fabrication, Dyker Heights", { eager: true })}</div>
</div></section>
<section class="why"><div class="wrap"><div class="grid three pillars">
  <article><span class="pillar-n">01</span><h3>Local</h3><p>We live and work in South Brooklyn. Our customers are our neighbors, so we do work we're proud to drive past.</p></article>
  <article><span class="pillar-n">02</span><h3>Hands-on</h3><p>The person who measures your job is the person who welds and installs it. Nothing is lost in translation.</p></article>
  <article><span class="pillar-n">03</span><h3>Versatile</h3><p>Stairs, railings, gates, fences, fire escapes, structural steel, stainless and aluminum — from a single hinge to a full staircase.</p></article>
</div></div></section>
<section class="split"><div class="wrap split-in"><div class="split-img">${pic("page:about2", "Welder creating sparks — mobile welding across NYC")}</div>
<div class="split-txt"><p class="kicker">Shop + mobile</p><h2>We come to you <em>when the metal can't move.</em></h2><p>Our self-powered mobile welding rig handles on-site repairs for gates, railings, fire escapes, storefront gates, trailers and job-site steel — anywhere in NYC.</p><a class="btn btn-dark" href="/services/mobile-welding/">Mobile welding ${ICON.arrow}</a></div></div></section>
${method(true)}`;
  add("/about/", page({ url: "/about/", title: "About Angir Welding & Fabrication | Dyker Heights, Brooklyn Metal Shop", desc: "Angir Welding & Fabrication is a Dyker Heights, Brooklyn welding and metal fabrication shop building custom railings, gates, stairs and steel — and doing mobile welding across NYC.", body, active: "about", og: "page:about", schema: [crumbs([["Home", "/"], ["About", "/about/"]])] }));
}

// ── CONTACT
{
  const body = `${crumbHtml([["Home", "/"], ["Contact", "/contact/"]])}
<section class="page-hero"><div class="wrap"><p class="kicker">Contact</p><h1>Get a quote <em>in minutes.</em></h1><p class="lede">Text photos and rough measurements for the fastest price. Or fill out the form and we'll call you back.</p></div></section>
<section><div class="wrap contact-grid">
  <div class="contact-cards">
    <a class="c-card red" href="${tel}">${ICON.phone}<span><b>Call</b>${esc(site.phoneDisplay)}</span></a>
    <a class="c-card" href="sms:${site.phoneHref}">${ICON.text}<span><b>Text photos</b>${esc(site.phoneDisplay)}</span></a>
    <a class="c-card" href="mailto:${esc(site.email)}">${ICON.mail}<span><b>Email</b>${esc(site.email)}</span></a>
    <a class="c-card" href="${esc(site.googleProfile)}" target="_blank" rel="noopener">${ICON.pin}<span><b>Shop</b>${esc(addr)}</span></a>
    <p class="hours"><b>Hours:</b> ${esc(site.hoursText)}</p>
    <div class="map-wrap"><iframe title="Map to Angir Welding & Fabrication" src="https://www.google.com/maps?q=${encodeURIComponent(addr)}&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </div>
  <div id="quote">${quoteForm("")}</div>
</div></section>`;
  add("/contact/", page({ url: "/contact/", title: "Contact Angir Welding & Fabrication | Free Quote | Brooklyn, NY", desc: `Call or text ${site.phoneDisplay} for welding and metal fabrication in Brooklyn. Shop at ${addr}. Free quotes for railings, gates, stairs and repairs.`, body, active: "contact", og: "page:hero", schema: [crumbs([["Home", "/"], ["Contact", "/contact/"]])] }));
}

// ── PHOTO CREDITS
{
  const used = Object.values(photos);
  const body = `${crumbHtml([["Home", "/"], ["Photo credits", "/credits/"]])}
<section class="page-hero"><div class="wrap prose"><p class="kicker">Credits</p><h1>Photo <em>credits.</em></h1><p class="lede">Photography on this site is from <a href="https://unsplash.com/?utm_source=angir_welding&utm_medium=referral" rel="noopener">Unsplash</a>, used under the Unsplash License. Thank you to these photographers. Photos illustrate the type of work described and are not photos of specific Angir projects.</p>
<ul class="credits">${[...new Map(used.map((p) => [p.un, p])).values()].map((p) => `<li><a href="https://unsplash.com/@${p.un}?utm_source=angir_welding&utm_medium=referral" rel="noopener">${esc(p.by)}</a></li>`).join("")}</ul></div></section>`;
  add("/credits/", page({ url: "/credits/", title: "Photo Credits | Angir Welding & Fabrication", desc: "Photography credits for the Angir Welding & Fabrication website.", body }));
}

// ── PRIVACY + 404
add("/privacy/", page({ url: "/privacy/", title: "Privacy Policy | Angir Welding & Fabrication", desc: "How Angir Welding & Fabrication handles information you send us.", body: `<section class="page-hero"><div class="wrap prose"><h1>Privacy policy</h1><p>When you call, text, email or send our quote form, we use your name, contact details, address and project information only to respond to you, quote and perform the work. We don't sell your information. Embedded Google Maps and Google Fonts may set their own cookies under Google's policies. To ask us to delete your information, email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p></div></section>` }));
pages.push(["/404.html", page({ url: "/404.html", title: "Page not found | Angir Welding & Fabrication", desc: "Page not found.", body: `<section class="page-hero center"><div class="wrap"><p class="kicker">404</p><h1>That page <em>came loose.</em></h1><p class="lede">Let's weld you back on track.</p><div class="hero-cta center"><a class="btn btn-red btn-lg" href="/">Home</a><a class="btn btn-ghost btn-lg" href="/services/">Services</a></div></div></section>` }).replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">')]);

// ─────────────────────────────────────────────────────────────
//  WRITE
// ─────────────────────────────────────────────────────────────
for (const [url, html] of pages) {
  const file = url.endsWith(".html") ? path.join(OUT, url) : path.join(OUT, url, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
// static assets
fs.mkdirSync(path.join(OUT, "assets/css"), { recursive: true });
fs.mkdirSync(path.join(OUT, "assets/js"), { recursive: true });
fs.copyFileSync(path.join(ROOT, "src/assets/site.css"), path.join(OUT, "assets/css/site.css"));
fs.copyFileSync(path.join(ROOT, "src/assets/site.js"), path.join(OUT, "assets/js/site.js"));

const today = new Date().toISOString().slice(0, 10);
const sm = pages.filter(([u]) => !u.endsWith(".html")).map(([u]) => {
  const pr = u === "/" ? "1.0" : u.startsWith("/services/") ? "0.9" : u.startsWith("/areas/") ? "0.8" : "0.6";
  return `<url><loc>${abs(u)}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`;
});
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm.join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`);
fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify({ name: site.name, short_name: "Angir", start_url: "/", display: "standalone", background_color: "#0c0c0c", theme_color: "#8d0d0c", icons: [{ src: "/assets/brand/logo-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/brand/logo-512.png", sizes: "512x512", type: "image/png" }] }, null, 2));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

console.log(`Built ${pages.length} pages → docs/`);
