// ─────────────────────────────────────────────────────────────
//  Angir illustration system
//  One visual language for every image on the site:
//  night-shop charcoal, faint blueprint grid, bright steel line-work,
//  a single deep-red accent member, and a warm weld-spark burst.
// ─────────────────────────────────────────────────────────────
const W = 1600, H = 1000, G = 860; // canvas + ground line
const C = {
  bg1: "#1b1a19", bg2: "#0c0c0c",
  steel: "#e4e0d8", steel2: "#9b968e", dim: "#57534d",
  red: "#c8261d", redDeep: "#8d0d0c",
  hot: "#ffb347", hot2: "#ff7a1a",
  glass: "rgba(170,200,215,0.10)",
};

// ── deterministic random so images are stable between builds
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ── primitives
const n = (v) => Math.round(v * 10) / 10;
const L = (x1, y1, x2, y2, w = 8, c = C.steel, extra = "") => `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const P = (d, w = 8, c = C.steel, fill = "none", extra = "") => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const R = (x, y, w, h, sw = 8, c = C.steel, fill = "none", rx = 0) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" stroke="${c}" stroke-width="${sw}" fill="${fill}" stroke-linejoin="round"/>`;
const O = (cx, cy, r, sw = 8, c = C.steel, fill = "none") => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" stroke="${c}" stroke-width="${sw}" fill="${fill}"/>`;
const poly = (pts, w = 8, c = C.steel, fill = "none") => `<polyline points="${pts.map((p) => p.map(n).join(",")).join(" ")}" stroke="${c}" stroke-width="${w}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`;

// vertical pickets between two (possibly sloped) lines
function pickets(x1, x2, step, topAt, botAt, w = 6, c = C.steel) {
  let s = "";
  for (let x = x1; x <= x2 + 0.1; x += step) s += L(x, topAt(x), x, botAt(x), w, c);
  return s;
}
// Archimedean scroll
function scroll(cx, cy, r, turns = 1.6, dir = 1, start = 0, w = 6, c = C.steel) {
  const pts = []; const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; const a = start + dir * t * turns * Math.PI * 2; const rr = r * (1 - t * 0.85);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return poly(pts, w, c);
}
const spear = (x, y, s = 16, c = C.steel) => `<path d="M${x - s * 0.6},${y + s * 0.4} L${x},${y - s} L${x + s * 0.6},${y + s * 0.4} Z" fill="${c}"/>`;
const ball = (x, y, r = 9, c = C.steel) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
function bricks(x, y, w, h, rowH = 34, c = "rgba(255,255,255,0.045)") {
  let s = `<g stroke="${c}" stroke-width="2">`;
  for (let yy = y, r = 0; yy < y + h; yy += rowH, r++) {
    s += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}"/>`;
    for (let xx = x + (r % 2 ? 40 : 0); xx < x + w; xx += 80) s += `<line x1="${xx}" y1="${yy}" x2="${xx}" y2="${Math.min(yy + rowH, y + h)}"/>`;
  }
  return s + "</g>";
}
function diamondPlate(x, y, w, h, c = "rgba(228,224,216,0.25)") {
  let s = `<g stroke="${c}" stroke-width="3" stroke-linecap="round">`;
  for (let yy = y + 14, r = 0; yy < y + h - 6; yy += 22, r++)
    for (let xx = x + 14 + (r % 2 ? 14 : 0); xx < x + w - 10; xx += 28) s += `<line x1="${xx - 6}" y1="${yy + (r % 2 ? 4 : -4)}" x2="${xx + 6}" y2="${yy + (r % 2 ? -4 : 4)}"/>`;
  return s + "</g>";
}

// ── weld spark burst (the signature element)
function weld(x, y, seed, size = 1) {
  const r = rng(seed); let s = `<g>`;
  s += `<circle cx="${x}" cy="${y}" r="${150 * size}" fill="url(#glow)"/>`;
  s += `<circle cx="${x}" cy="${y}" r="${46 * size}" fill="url(#core)"/>`;
  for (let i = 0; i < 46; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * Math.PI * 1.9;
    const d0 = (14 + r() * 30) * size, d1 = d0 + (40 + r() * 190) * size;
    const x1 = x + Math.cos(a) * d0, y1 = y + Math.sin(a) * d0;
    const x2 = x + Math.cos(a) * d1, y2 = y + Math.sin(a) * d1 + r() * 60 * size; // gravity
    const w = (1.2 + r() * 2.6) * size;
    s += `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${r() > 0.35 ? C.hot : "#fff3d6"}" stroke-width="${n(w)}" stroke-linecap="round" opacity="${n(0.55 + r() * 0.45)}"/>`;
  }
  for (let i = 0; i < 14; i++) {
    const a = Math.PI * (0.1 + r() * 0.8); const d = (120 + r() * 220) * size;
    s += `<circle cx="${n(x + Math.cos(a) * d * (r() > 0.5 ? 1 : -1))}" cy="${n(y + Math.sin(a) * d * 0.6 + 40)}" r="${n(1.5 + r() * 2.5)}" fill="${C.hot}" opacity="${n(0.4 + r() * 0.5)}"/>`;
  }
  return s + `</g>`;
}

// ── frame (background, grid, ground, vignette)
function frame(inner, seed, opts = {}) {
  const r = rng(seed);
  const gx = opts.glowX ?? 200 + r() * 1200;
  let grid = `<g stroke="rgba(255,255,255,0.035)" stroke-width="1">`;
  for (let x = 0; x <= W; x += 50) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  for (let y = 0; y <= H; y += 50) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  grid += `</g>`;
  // blueprint dimension mark (subtle, adds the "measured" story)
  const dimY = 70;
  const dims = `<g stroke="rgba(228,224,216,0.22)" stroke-width="2" fill="rgba(228,224,216,0.32)" font-family="Outfit, 'Inter Display', Inter, Arial" font-size="22" letter-spacing="3">
    <line x1="80" y1="${dimY}" x2="420" y2="${dimY}"/><line x1="80" y1="${dimY - 12}" x2="80" y2="${dimY + 12}"/><line x1="420" y1="${dimY - 12}" x2="420" y2="${dimY + 12}"/>
    <text x="96" y="${dimY - 18}" stroke="none">${opts.label ?? "ANGIR · BROOKLYN"}</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>
  <radialGradient id="mood" cx="${gx / W}" cy="0.95" r="0.75"><stop offset="0" stop-color="${C.redDeep}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.redDeep}" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="${C.hot2}" stop-opacity="0.55"/><stop offset="0.4" stop-color="${C.hot2}" stop-opacity="0.18"/><stop offset="1" stop-color="${C.hot2}" stop-opacity="0"/></radialGradient>
  <radialGradient id="core"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="#fff1c9"/><stop offset="1" stop-color="${C.hot}" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.65"/></radialGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#mood)"/>
${grid}
${opts.noDims ? "" : dims}
${opts.noGround ? "" : `<line x1="0" y1="${G}" x2="${W}" y2="${G}" stroke="${C.dim}" stroke-width="4"/><rect x="0" y="${G}" width="${W}" height="${H - G}" fill="url(#floor)"/>`}
${inner}
<rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
}

// ─────────────────────────────────────────────────────────────
//  MOTIFS — each returns inner SVG; most end with a weld burst
// ─────────────────────────────────────────────────────────────
const M = {};

M.stairs = (sd) => {
  let s = ""; const x0 = 330, steps = 10, dx = 82, dy = 58;
  const prof = [[x0, G]];
  for (let i = 0; i < steps; i++) { const x = x0 + i * dx, y = G - (i + 1) * dy; prof.push([x, y], [x + dx, y]); }
  const topX = x0 + steps * dx, topY = G - steps * dy;
  s += poly(prof, 7, C.steel);
  // treads (thick)
  for (let i = 0; i < steps; i++) { const x = x0 + i * dx, y = G - (i + 1) * dy; s += L(x + 4, y, x + dx + 8, y, 14, C.steel); }
  // stringer
  s += L(x0 - 20, G + 4, topX + 10, topY + 70, 18, C.steel2);
  // landing
  s += L(topX, topY, 1420, topY, 16, C.steel) + L(1420, topY, 1420, G, 12, C.steel2) + L(topX + 120, topY, topX + 120, G, 10, C.steel2);
  // rail: posts + red handrail
  const railH = 190;
  for (let i = 0; i <= steps; i += 2) { const x = x0 + i * dx + 40, y = G - (i + 0.5) * dy; s += L(x, y, x, y - railH, 8, C.steel); }
  s += L(x0 + 40, G - 0.5 * dy - railH, topX + 40, topY + 0.5 * dy - railH - 28, 14, C.red);
  s += L(topX + 40, topY - railH + 2, 1420, topY - railH + 2, 14, C.red);
  for (let x = topX + 40; x <= 1420; x += 95) s += L(x, topY, x, topY - railH, 8, C.steel);
  s += weld(x0 + 6 * dx + 40, G - 6.5 * dy, sd);
  return s;
};

M.spiral = (sd) => {
  let s = ""; const cx = 800, top = 150, bot = G, n_ = 15; const Rr = 330;
  s += L(cx, top - 30, cx, G, 22, C.steel2);
  const outer = []; const rail = [];
  for (let i = 0; i < n_; i++) {
    const a = (i / n_) * Math.PI * 2.4 - Math.PI / 2;
    const y = bot - 40 - i * ((bot - top - 40) / n_);
    const ex = cx + Math.cos(a) * Rr, ey = y + Math.sin(a) * 70;
    const back = Math.sin(a) < 0;
    s += L(cx, y, ex, ey, back ? 10 : 16, back ? C.steel2 : C.steel);
    s += L(ex, ey, ex, ey - 170, back ? 4 : 6, back ? C.dim : C.steel);
    outer.push([ex, ey]); rail.push([ex, ey - 170]);
  }
  s += poly(rail, 12, C.red);
  s += L(cx - 380, top - 40, cx + 380, top - 40, 14, C.steel) + L(cx + 380, top - 40, cx + 380, top - 220, 8, C.steel2);
  s += weld(outer[5][0], outer[5][1], sd, 0.9);
  return s;
};

M.railing = (sd) => {
  let s = ""; const x0 = 260, x1 = 1340, y0 = G - 20, y1 = 300;
  const slope = (x) => y0 - ((x - x0) / (x1 - x0)) * (y0 - y1);
  // stair profile
  const prof = []; for (let i = 0; i <= 12; i++) { const x = x0 + i * 90, y = slope(x); prof.push([x, y + 40], [x + 90, y + 40]); }
  s += poly(prof.slice(0, -1), 6, C.steel2);
  s += bricks(0, 0, W, G, 40);
  // flat-bar pickets
  s += pickets(x0 + 40, x1 - 40, 34, (x) => slope(x) - 230, (x) => slope(x) + 34, 6, C.steel);
  // newel posts
  s += R(x0 - 30, slope(x0) - 300, 34, 330, 6, C.steel, "#1b1a19");
  s += R(x1 - 10, slope(x1) - 300, 34, 330, 6, C.steel, "#1b1a19");
  // bottom rail + handrail
  s += L(x0, slope(x0) + 10, x1, slope(x1) + 10, 10, C.steel);
  s += L(x0 - 30, slope(x0) - 240, x1 + 24, slope(x1) - 240, 18, C.red);
  s += weld(x0 + 420, slope(x0 + 420) - 236, sd, 0.85);
  return s;
};

M.stoop = (sd) => {
  let s = bricks(820, 120, 780, G - 120, 38);
  // facade + door
  s += R(1040, 210, 260, 420, 8, C.steel2) + P(`M1040,330 Q1170,170 1300,330`, 8, C.steel2);
  s += R(1110, 340, 120, 290, 6, C.steel2) + O(1210, 490, 7, 0, C.steel, C.steel);
  s += R(870, 220, 110, 200, 6, C.dim) + R(1360, 220, 110, 200, 6, C.dim);
  // stoop steps
  const st = []; for (let i = 0; i < 9; i++) { st.push([200 + i * 95, G - i * 26], [200 + (i + 1) * 95, G - i * 26], [200 + (i + 1) * 95, G - (i + 1) * 26]); }
  s += poly([[200, G], ...st, [1040, G - 234], [1040, G]], 6, C.steel2, "rgba(255,255,255,0.02)");
  // railing following stoop
  const y = (x) => G - ((x - 200) / 855) * 234 - 210;
  s += pickets(250, 1020, 42, (x) => y(x) + 6, (x) => y(x) + 210 - 8, 6);
  for (let x = 250; x <= 1020; x += 84) s += spear(x, y(x) - 6, 13);
  s += L(220, y(220), 1040, y(1040), 14, C.red);
  s += L(220, y(220) + 150, 1040, y(1040) + 150, 7, C.steel);
  // newel scroll
  s += scroll(170, G - 130, 70, 1.5, -1, 0, 9, C.steel) + L(205, G - 130, 220, y(220), 10, C.steel);
  s += weld(600, y(600) + 150, sd, 0.85);
  return s;
};

M.balcony = (sd) => {
  let s = bricks(260, 120, 1080, G - 120, 38);
  s += R(260, 120, 1080, G - 120, 6, C.dim);
  // windows
  for (const x of [360, 720, 1080]) { s += R(x, 160, 160, 210, 6, C.steel2) + R(x, 560, 160, 230, 6, C.steel2); }
  // balcony slab
  s += R(200, 420, 1200, 26, 6, C.steel, "#232120");
  // brackets
  s += P(`M300,446 L300,520 L380,446`, 8, C.steel2) + P(`M1300,446 L1300,520 L1220,446`, 8, C.steel2);
  // railing
  s += pickets(220, 1380, 40, () => 260, () => 418, 6);
  s += L(200, 252, 1400, 252, 16, C.red) + L(200, 300, 1400, 300, 6, C.steel);
  for (const x of [200, 800, 1400]) s += L(x, 248, x, 420, 12, C.steel);
  // roof deck rail
  s += weld(800, 300, sd, 0.85);
  return s;
};

M.glassrail = (sd) => {
  let s = ""; const y0 = 300, y1 = 760;
  s += L(120, y1 + 10, 1480, y1 + 10, 12, C.steel2);
  for (let i = 0; i < 4; i++) {
    const x = 180 + i * 330;
    s += R(x + 24, y0 + 30, 280, y1 - y0 - 40, 3, "rgba(200,225,235,0.45)", C.glass, 6);
    s += L(x + 70, y0 + 70, x + 150, y0 + 200, 4, "rgba(255,255,255,0.18)") + L(x + 90, y0 + 60, x + 200, y0 + 240, 3, "rgba(255,255,255,0.12)");
  }
  for (let i = 0; i <= 4; i++) { const x = 180 + i * 330; s += R(x - 14, y0, 28, y1 - y0 + 10, 5, C.steel, "#2a2928", 4); }
  s += L(150, y0 - 10, 1510, y0 - 10, 22, C.red);
  // cable variant on right
  s += weld(180 + 2 * 330, y0 - 10, sd, 0.8);
  return s;
};

M.handrail = (sd) => {
  let s = "";
  // ramp
  s += poly([[160, G], [1300, G - 200], [1500, G - 200], [1500, G]], 8, C.steel2, "rgba(255,255,255,0.03)");
  const y = (x) => G - ((x - 160) / 1140) * 200;
  for (let x = 220; x <= 1260; x += 260) s += L(x, y(x), x, y(x) - 260, 12, C.steel);
  s += L(1420, G - 200, 1420, G - 460, 12, C.steel);
  // two rails w/ returns
  s += P(`M160,${G - 170} Q120,${G - 170} 120,${G - 120} L120,${G - 90}`, 14, C.red);
  s += L(160, G - 170, 1300, y(1300) - 260 + 0, 14, C.red) + L(1300, y(1300) - 260, 1490, G - 460, 14, C.red);
  s += L(160, G - 90, 1300, y(1300) - 140, 9, C.steel) + L(1300, y(1300) - 140, 1490, G - 340, 9, C.steel);
  s += weld(740, y(740) - 260, sd, 0.85);
  return s;
};

M.gate = (sd) => {
  let s = "";
  // brick pillars
  s += R(150, 260, 170, G - 260, 6, C.steel2, "#201f1e") + bricks(150, 260, 170, G - 260, 30, "rgba(255,255,255,0.08)") + R(130, 230, 210, 34, 6, C.steel, "#2a2928") + ball(235, 205, 26, C.steel);
  s += R(1280, 260, 170, G - 260, 6, C.steel2, "#201f1e") + bricks(1280, 260, 170, G - 260, 30, "rgba(255,255,255,0.08)") + R(1260, 230, 210, 34, 6, C.steel, "#2a2928") + ball(1365, 205, 26, C.steel);
  // arched gates
  const arch = (x) => 360 - 120 * Math.sin(((x - 320) / 960) * Math.PI);
  s += pickets(350, 1250, 38, (x) => arch(x) - 30, () => G - 40, 6);
  for (let x = 350; x <= 1250; x += 38) s += spear(x, arch(x) - 34, 14);
  let pts = []; for (let x = 320; x <= 1280; x += 20) pts.push([x, arch(x) + 10]); s += poly(pts, 14, C.red);
  s += L(320, 520, 1280, 520, 10, C.steel) + L(320, G - 40, 1280, G - 40, 12, C.steel);
  s += L(800, arch(800), 800, G - 40, 12, C.steel);
  // scroll medallions
  s += O(560, 640, 70, 8) + scroll(560, 640, 60, 1.4, 1, 0, 6) + O(1040, 640, 70, 8) + scroll(1040, 640, 60, 1.4, -1, Math.PI, 6);
  s += weld(800, 520, sd, 0.9);
  return s;
};

M.slidegate = (sd) => {
  let s = "";
  s += R(160, 300, 60, G - 300, 6, C.steel2, "#232120") + R(1380, 300, 60, G - 300, 6, C.steel2, "#232120");
  // gate frame with truss (cantilever tail)
  const gx = 240, gw = 1080, gy = 380, gh = 380;
  s += R(gx, gy, gw, gh, 12, C.steel);
  for (let x = gx + 40; x < gx + gw; x += 40) s += L(x, gy + 6, x, gy + gh - 6, 5, C.steel2);
  s += L(gx, gy + gh, gx + 340, gy, 9, C.steel) + L(gx + 340, gy, gx + 680, gy + gh, 9, C.steel);
  // rollers
  s += O(300, G - 60, 26, 7) + O(420, G - 60, 26, 7) + R(250, G - 30, 230, 22, 5, C.steel2);
  // motor + arrow
  s += R(200, G - 150, 90, 120, 6, C.red, "#3a1513", 6);
  s += `<g stroke="${C.red}" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="2 22"><line x1="1240" y1="250" x2="560" y2="250"/></g>`;
  s += P(`M590,220 L550,250 L590,280`, 10, C.red);
  s += weld(gx + 340, gy, sd, 0.9);
  return s;
};

M.fence = (sd) => {
  let s = "";
  // faint house behind
  s += P(`M520,420 L800,220 L1080,420 L1080,${G} L520,${G} Z`, 5, C.dim) + R(620, 520, 120, 150, 4, C.dim) + R(860, 520, 120, 150, 4, C.dim) + R(740, 700, 120, 160, 4, C.dim);
  // fence
  s += pickets(90, 1510, 32, () => 600, () => G - 10, 6);
  for (let x = 90; x <= 1510; x += 32) s += spear(x, 594, 12);
  s += L(70, 620, 1530, 620, 10, C.steel) + L(70, G - 50, 1530, G - 50, 10, C.steel);
  for (const x of [70, 430, 790, 1150, 1530]) s += R(x - 18, 560, 36, G - 560, 6, C.steel, "#232120") + ball(x, 540, 20, C.red);
  s += weld(610, 620, sd, 0.85);
  return s;
};

M.windowguard = (sd) => {
  let s = bricks(0, 0, W, G, 38, "rgba(255,255,255,0.06)");
  const win = (x, y, w, h, red) => {
    let t = R(x, y, w, h, 8, C.steel2, "#141312") + L(x, y + h / 2, x + w, y + h / 2, 6, C.dim) + L(x + w / 2, y, x + w / 2, y + h, 4, C.dim);
    t += R(x - 26, y - 26, w + 52, h + 52, 10, red ? C.red : C.steel);
    t += pickets(x - 6, x + w + 6, 34, () => y - 22, () => y + h + 22, 6);
    t += L(x - 26, y + h * 0.33, x + w + 26, y + h * 0.33, 6, C.steel) + L(x - 26, y + h * 0.7, x + w + 26, y + h * 0.7, 6, C.steel);
    t += scroll(x + w * 0.3, y + 30, 26, 1.3, 1, 0, 5) + scroll(x + w * 0.7, y + 30, 26, 1.3, -1, Math.PI, 5);
    return t;
  };
  s += win(260, 230, 340, 470, true) + win(1000, 230, 340, 470, false);
  s += L(220, 760, 640, 760, 10, C.steel2) + L(960, 760, 1380, 760, 10, C.steel2);
  s += weld(600, 700, sd, 0.85);
  return s;
};

M.door = (sd) => {
  let s = bricks(0, 0, W, G, 38, "rgba(255,255,255,0.05)");
  s += R(520, 160, 560, G - 160, 14, C.steel2, "#141312");
  s += R(560, 200, 480, G - 220, 12, C.steel, C.glass);
  // diamond lattice
  let lat = "";
  for (let k = -6; k < 12; k++) { lat += L(560 + k * 80, 200, 560 + k * 80 + 660, G - 20, 6, C.steel) + L(1040 - k * 80, 200, 1040 - k * 80 - 660, G - 20, 6, C.steel); }
  s += `<clipPath id="dc"><rect x="560" y="200" width="480" height="${G - 220}"/></clipPath><g clip-path="url(#dc)">${lat}</g>`;
  s += R(560, 200, 480, G - 220, 12, C.steel);
  s += R(980, 480, 50, 110, 6, C.red, "#3a1513", 6) + O(1005, 515, 9, 0, C.steel, C.steel) + L(985, 560, 1025, 560, 8, C.steel);
  for (const y of [260, 520, G - 120]) s += R(536, y, 28, 70, 5, C.steel2, "#232120");
  s += weld(560, 520, sd, 0.85);
  return s;
};

M.fireescape = (sd) => {
  let s = bricks(240, 0, 1120, G, 38, "rgba(255,255,255,0.055)") + R(240, -10, 1120, G + 10, 6, C.dim);
  const levels = [200, 455, 710];
  for (const y of levels) {
    for (const x of [340, 980]) s += R(x, y - 150, 120, 150, 5, C.steel2, "#141312") + R(x + 150, y - 150, 120, 150, 5, C.steel2, "#141312");
    s += R(300, y, 1000, 18, 5, C.steel, "#2a2928");
    for (let x = 310; x < 1300; x += 22) s += L(x, y + 3, x, y + 15, 2, C.steel2);
    s += pickets(310, 1290, 40, () => y - 110, () => y - 2, 4);
    s += L(300, y - 112, 1300, y - 112, 9, C.steel) + L(300, y - 60, 1300, y - 60, 5, C.steel);
    s += P(`M320,${y + 18} L320,${y + 90} L400,${y + 18}`, 8, C.steel2) + P(`M1280,${y + 18} L1280,${y + 90} L1200,${y + 18}`, 8, C.steel2);
  }
  // stairs between levels
  for (let i = 0; i < 2; i++) {
    const ya = levels[i] + 18, yb = levels[i + 1];
    s += L(560, yb, 840, ya, 8, C.steel) + L(610, yb, 890, ya, 8, C.steel);
    for (let k = 1; k < 8; k++) { const t = k / 8; s += L(560 + 280 * t, yb - (yb - ya) * t, 610 + 280 * t, yb - (yb - ya) * t, 5, C.steel2); }
  }
  // drop ladder (red)
  s += L(1080, 728, 1080, 845, 9, C.red) + L(1140, 728, 1140, 845, 9, C.red);
  for (let y = 750; y <= 835; y += 24) s += L(1080, y, 1140, y, 6, C.red);
  s += weld(320, 473, sd, 0.85);
  return s;
};

M.beam = (sd) => {
  let s = bricks(0, 0, 260, G, 38, "rgba(255,255,255,0.06)") + bricks(1340, 0, 260, G, 38, "rgba(255,255,255,0.06)");
  const ib = (x, y, w, h, c, fill = "#262423") => R(x, y, w, 26, 6, c, fill) + R(x, y + h - 26, w, 26, 6, c, fill) + R(x + w / 2 - 9, y + 26, 18, h - 52, 4, c, fill);
  // main beam (horizontal I)
  s += R(260, 210, 1080, 30, 7, C.red, "#3a1513") + R(260, 330, 1080, 30, 7, C.red, "#3a1513") + R(260, 240, 1080, 90, 3, "rgba(200,38,29,0.4)", "rgba(200,38,29,0.10)");
  for (let x = 300; x < 1340; x += 120) s += O(x, 225, 5, 0, C.steel, C.steel) + O(x, 345, 5, 0, C.steel, C.steel);
  // columns
  s += ib(330, 360, 70, G - 360, C.steel) + ib(1200, 360, 70, G - 360, C.steel);
  s += R(300, G - 26, 130, 26, 6, C.steel, "#2a2928") + R(1170, G - 26, 130, 26, 6, C.steel, "#2a2928");
  // joists above
  for (let x = 280; x < 1340; x += 70) s += L(x, 80, x, 208, 10, C.dim);
  s += L(260, 80, 1340, 80, 8, C.dim);
  s += weld(400, 360, sd, 0.85);
  return s;
};

M.lintel = (sd) => {
  let s = bricks(0, 0, W, G, 40, "rgba(255,255,255,0.08)");
  s += R(520, 340, 560, 470, 10, C.steel2, "#121110") + L(800, 340, 800, 810, 6, C.dim) + L(520, 575, 1080, 575, 6, C.dim);
  // lintel (red L angle)
  s += P(`M470,300 L1130,300 L1130,322 L492,322 L492,340`, 0, "none", C.red);
  s += R(470, 296, 660, 24, 6, C.red, "#5a1714") + L(492, 318, 492, 344, 10, C.red);
  // crack in brick
  s += poly([[1180, 300], [1220, 260], [1215, 220], [1260, 180], [1255, 140], [1300, 100]], 4, "rgba(228,224,216,0.5)");
  s += `<g fill="rgba(140,70,40,0.45)"><circle cx="1150" cy="330" r="6"/><circle cx="1158" cy="352" r="4"/><circle cx="1150" cy="380" r="5"/></g>`;
  s += weld(1130, 310, sd, 0.85);
  return s;
};

M.cellar = (sd) => {
  let s = "";
  // storefront base behind
  s += R(160, 120, 1280, 420, 6, C.dim) + R(220, 170, 540, 330, 4, C.dim) + R(840, 170, 540, 330, 4, C.dim);
  // sidewalk perspective
  s += poly([[0, 600], [1600, 600]], 6, C.steel2);
  // doors (perspective trapezoid)
  const d = (x1, x2) => `M${x1},640 L${x2},640 L${x2 + 40},880 L${x1 - 40},880 Z`;
  s += P(d(420, 790), 10, C.steel, "#232120") + P(d(810, 1180), 10, C.steel, "#232120");
  s += `<clipPath id="cd"><path d="${d(420, 790)} ${d(810, 1180)}"/></clipPath><g clip-path="url(#cd)">${diamondPlate(360, 640, 900, 240)}</g>`;
  s += R(380, 620, 840, 280, 10, C.steel2);
  // hinges + chain
  for (const x of [470, 720, 860, 1110]) s += R(x - 20, 652, 40, 22, 4, C.steel, "#2a2928");
  s += P(`M790,700 Q800,760 810,700`, 8, C.red) + O(800, 740, 12, 6, C.red);
  s += weld(800, 650, sd, 0.85);
  return s;
};

M.canopy = (sd) => {
  let s = bricks(0, 0, 360, G, 38, "rgba(255,255,255,0.06)") + R(0, 0, 360, G, 6, C.dim);
  // posts
  for (const x of [720, 1380]) s += R(x - 16, 330, 32, G - 330, 6, C.steel, "#232120");
  // main beams
  s += L(340, 320, 1440, 320, 22, C.steel) + L(340, 380, 1440, 380, 14, C.red);
  // rafters receding
  for (let x = 380; x <= 1420; x += 80) s += L(x, 300, x + 60, 200, 10, C.steel2);
  s += L(420, 200, 1480, 200, 10, C.steel2);
  // knee braces
  s += L(720, 450, 640, 380, 9, C.steel) + L(720, 450, 800, 380, 9, C.steel) + L(1380, 450, 1300, 380, 9, C.steel);
  s += weld(720, 380, sd, 0.85);
  return s;
};

M.ladder = (sd) => {
  let s = bricks(400, 300, 800, G - 300, 38, "rgba(255,255,255,0.06)");
  s += R(400, 300, 800, G - 300, 6, C.dim) + R(380, 270, 840, 34, 6, C.steel2, "#232120");
  // ladder rails
  s += L(760, G, 760, 320, 12, C.steel) + L(860, G, 860, 320, 12, C.steel);
  for (let y = G - 40; y > 320; y -= 50) s += L(760, y, 860, y, 7, C.steel);
  // gooseneck (red)
  s += P(`M760,320 L760,250 Q760,180 820,180 L900,180 Q950,180 950,240 L950,270`, 12, C.red);
  s += P(`M860,320 L860,250 Q860,220 890,220 L900,220 Q910,220 910,240 L910,270`, 12, C.red);
  // cage hoops
  for (let y = 360; y < 700; y += 70) s += P(`M740,${y} Q810,${y - 60} 880,${y}`, 6, C.steel2);
  for (const x of [740, 810, 880]) s += L(x, 330, x, 700, 4, C.dim);
  s += weld(760, 320, sd, 0.85);
  return s;
};

M.mezzanine = (sd) => {
  let s = "";
  // deck
  s += R(260, 420, 1140, 36, 8, C.steel, "#262423");
  for (let x = 270; x < 1400; x += 18) s += L(x, 424, x, 452, 2, C.steel2);
  // columns
  for (const x of [300, 830, 1360]) s += R(x - 14, 456, 28, G - 456, 6, C.steel, "#232120");
  // guardrail (red)
  s += L(260, 260, 1400, 260, 14, C.red) + L(260, 340, 1400, 340, 8, C.steel);
  for (let x = 260; x <= 1400; x += 190) s += L(x, 256, x, 420, 10, C.steel);
  // stair
  s += L(120, G, 260, 456, 12, C.steel) + L(170, G, 310, 456, 12, C.steel2);
  for (let k = 1; k < 10; k++) { const t = k / 10; s += L(120 + 140 * t, G - (G - 456) * t, 170 + 140 * t, G - (G - 456) * t, 6, C.steel2); }
  // boxes below
  for (const [x, y, w, h] of [[420, 700, 160, 160], [600, 740, 120, 120], [960, 680, 200, 180], [1180, 760, 120, 100]]) s += R(x, y, w, h, 5, C.dim);
  s += weld(830, 456, sd, 0.85);
  return s;
};

M.treeguard = (sd) => {
  let s = "";
  s += R(0, 120, W, 560, 4, C.dim) + R(120, 180, 420, 300, 4, C.dim) + R(1060, 180, 420, 300, 4, C.dim);
  // tree
  s += L(800, G - 40, 800, 260, 26, C.steel2) + L(800, 420, 700, 320, 12, C.steel2) + L(800, 360, 900, 280, 12, C.steel2);
  s += `<g fill="rgba(228,224,216,0.06)" stroke="${C.steel2}" stroke-width="4"><circle cx="720" cy="230" r="120"/><circle cx="880" cy="200" r="140"/><circle cx="800" cy="300" r="110"/></g>`;
  // pit
  s += P(`M470,${G - 30} L1130,${G - 30} L1200,${G + 70} L400,${G + 70} Z`, 6, C.steel2, "rgba(60,40,25,0.4)");
  // guard
  s += L(450, G - 160, 1150, G - 160, 14, C.red);
  for (let x = 470; x <= 1130; x += 60) s += P(`M${x},${G - 20} L${x},${G - 140} Q${x + 30},${G - 190} ${x + 60},${G - 140}`, 6, C.steel);
  for (const x of [450, 1150]) s += R(x - 14, G - 190, 28, 190, 6, C.steel, "#232120") + ball(x, G - 200, 14, C.steel);
  s += weld(1150, G - 160, sd, 0.8);
  return s;
};

M.rollgate = (sd) => {
  let s = bricks(0, 0, W, G, 40, "rgba(255,255,255,0.05)");
  s += R(200, 120, 1200, 160, 6, C.steel2, "#1a1918") ; // sign band
  s += `<text x="800" y="225" text-anchor="middle" font-family="Outfit, 'Inter Display', Inter, Arial" font-weight="700" font-size="64" fill="rgba(228,224,216,0.22)" letter-spacing="10">STOREFRONT</text>`;
  s += R(220, 290, 1160, 90, 8, C.red, "#3a1513", 6); // hood
  s += R(230, 380, 26, G - 380, 6, C.steel, "#232120") + R(1344, 380, 26, G - 380, 6, C.steel, "#232120");
  // curtain (half open)
  const bottom = 680;
  for (let y = 384; y < bottom; y += 22) {
    s += L(256, y, 1344, y, 3, C.steel2);
    for (let x = 290; x < 1330; x += 46) s += R(x, y + 6, 26, 10, 0, "none", "rgba(228,224,216,0.35)", 3);
  }
  s += R(250, bottom, 1100, 24, 6, C.steel, "#2a2928");
  // store visible below
  s += R(300, bottom + 40, 460, G - bottom - 50, 4, C.dim) + R(840, bottom + 40, 460, G - bottom - 50, 4, C.dim);
  s += weld(1344, 560, sd, 0.85);
  return s;
};

M.kitchen = (sd) => {
  let s = "";
  s += R(0, 0, W, 520, 0, "none", "rgba(255,255,255,0.02)");
  for (let x = 0; x < W; x += 80) s += L(x, 0, x, 520, 1, "rgba(255,255,255,0.05)");
  // wall shelf
  s += L(260, 220, 1340, 220, 12, C.steel) + P(`M320,220 L320,280 L380,220`, 6, C.steel2) + P(`M1280,220 L1280,280 L1220,220`, 6, C.steel2);
  // pot rail (red) + pots
  s += L(420, 120, 1180, 120, 10, C.red);
  for (const x of [520, 700, 880, 1060]) s += L(x, 120, x, 160, 4, C.steel2) + P(`M${x - 40},170 L${x + 40},170 L${x + 30},210 L${x - 30},210 Z`, 4, C.steel2);
  // table
  s += R(200, 520, 1200, 40, 8, C.steel, "rgba(228,224,216,0.12)") + L(200, 500, 1400, 500, 6, C.steel);
  for (const x of [240, 1360]) s += L(x, 560, x, G, 14, C.steel);
  s += R(230, 760, 1140, 20, 6, C.steel2, "rgba(228,224,216,0.06)");
  s += L(800, 560, 800, 760, 10, C.steel);
  s += weld(1360, 560, sd, 0.8);
  return s;
};

M.bollard = (sd) => {
  let s = R(0, 140, W, 520, 4, C.dim) + R(180, 200, 560, 360, 4, C.dim) + R(860, 200, 560, 360, 4, C.dim);
  s += L(0, 700, W, 700, 6, C.steel2);
  for (const [i, x] of [260, 580, 900, 1220].entries()) {
    s += R(x, 480, 120, G - 480, 8, C.steel, "#2a2928", 14);
    s += P(`M${x},500 Q${x + 60},440 ${x + 120},500`, 8, C.steel, "#2a2928");
    s += R(x + 4, 560, 112, 34, 0, "none", C.red) + R(x + 4, 640, 112, 34, 0, "none", C.red);
  }
  s += weld(640, 480, sd, 0.85);
  return s;
};

M.fabrication = (sd) => {
  let s = "";
  // bench
  s += R(160, 600, 1280, 40, 8, C.steel, "#262423") + L(220, 640, 220, G, 14, C.steel) + L(1380, 640, 1380, G, 14, C.steel) + L(220, 780, 1380, 780, 8, C.steel2);
  // vise
  s += R(240, 520, 160, 80, 6, C.steel2, "#232120") + L(400, 560, 470, 560, 10, C.steel2);
  // bracket (red)
  s += P(`M560,600 L560,360 L640,360 L640,520 L880,520 L880,600 Z`, 10, C.red, "rgba(200,38,29,0.12)");
  s += O(600, 410, 14, 6, C.red) + O(780, 560, 14, 6, C.red);
  s += L(640, 360, 880, 520, 10, C.red);
  // tube + angle pieces
  s += R(960, 520, 360, 50, 6, C.steel, "#2a2928") + P(`M980,480 L1320,480 L1320,450`, 8, C.steel2);
  // calipers / square
  s += P(`M1040,300 L1340,300 L1340,330 L1070,330 L1070,440 L1040,440 Z`, 6, C.steel2);
  s += weld(880, 520, sd);
  return s;
};

M.ornamental = (sd) => {
  let s = "";
  s += R(260, 180, 1080, 600, 14, C.steel);
  s += L(260, 480, 1340, 480, 8, C.steel2);
  // mirrored scroll pairs
  for (const [cx, dir, st] of [[440, 1, 0], [620, -1, Math.PI], [980, 1, 0], [1160, -1, Math.PI]]) {
    s += scroll(cx, 330, 110, 1.7, dir, st, 8) + scroll(cx, 630, 110, 1.7, -dir, st + Math.PI, 8);
  }
  // rosette (red)
  s += O(800, 480, 92, 10, C.red, "#2a1110");
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; s += `<ellipse cx="${n(800 + Math.cos(a) * 52)}" cy="${n(480 + Math.sin(a) * 52)}" rx="26" ry="13" transform="rotate(${n((a * 180) / Math.PI)} ${n(800 + Math.cos(a) * 52)} ${n(480 + Math.sin(a) * 52)})" stroke="${C.red}" stroke-width="5" fill="none"/>`; }
  s += ball(800, 480, 16, C.red);
  for (let x = 300; x <= 1300; x += 100) s += spear(x, 166, 20);
  s += weld(800, 780, sd, 0.85);
  return s;
};

M.furniture = (sd) => {
  let s = "";
  // table
  s += R(160, 470, 760, 44, 6, C.steel2, "rgba(150,110,70,0.35)", 4);
  s += P(`M240,514 L320,${G} M840,514 L760,${G}`, 14, C.steel) + L(280, 700, 800, 700, 10, C.steel);
  s += P(`M240,514 L320,${G}`, 14, C.steel);
  // shelving (red frame)
  s += R(1060, 160, 360, 700, 12, C.red);
  for (const y of [300, 460, 620, 780]) s += R(1066, y, 348, 20, 0, "none", "rgba(150,110,70,0.35)");
  s += L(1060, 160, 1420, G, 4, "rgba(200,38,29,0.4)");
  for (const [x, y, w, h] of [[1100, 240, 70, 60], [1200, 400, 140, 60], [1110, 560, 60, 60], [1260, 720, 90, 60]]) s += R(x, y, w, h, 4, C.dim);
  s += weld(760, 700, sd, 0.85);
  return s;
};

M.paint = (sd) => {
  let s = "";
  const top = 360;
  s += L(160, top, 1440, top, 14, C.steel) + L(160, G - 60, 1440, G - 60, 10, C.steel);
  for (let x = 180; x <= 1420; x += 46) {
    const rusty = x < 760;
    s += L(x, top + 6, x, G - 66, 7, rusty ? "#8a5a3a" : C.steel);
    if (rusty) s += `<g fill="rgba(170,90,40,0.6)"><circle cx="${x + 4}" cy="${top + 120 + (x % 90)}" r="6"/><circle cx="${x - 3}" cy="${top + 260 + (x % 70)}" r="4"/></g>`;
  }
  // red paint stroke + brush
  s += P(`M760,${top - 60} Q900,${top - 120} 1080,${top - 70} T1420,${top - 80}`, 22, C.red);
  s += R(700, top - 110, 90, 60, 6, C.steel2, "#2a2928", 6) + L(700, top - 80, 560, top - 160, 14, C.steel2);
  s += weld(760, top, sd, 0.8);
  return s;
};

M.torch = (sd) => {
  let s = "";
  // plates on bench
  s += R(220, 640, 1160, 40, 8, C.steel, "#262423");
  s += P(`M380,640 L780,640 L780,600 L380,600 Z`, 6, C.steel2, "#2a2928") + P(`M780,640 L1180,640 L1180,600 L780,600 Z`, 6, C.steel2, "#2a2928");
  // bead
  let bead = ""; for (let x = 460; x < 780; x += 18) bead += `<ellipse cx="${x}" cy="600" rx="12" ry="7" fill="none" stroke="${C.hot}" stroke-width="3" opacity="0.8"/>`; s += bead;
  // MIG gun (red handle)
  s += P(`M800,560 L960,380 L1040,320`, 22, C.steel) + P(`M1040,320 L1180,250 Q1240,230 1260,280 L1150,360 Z`, 10, C.red, "#3a1513") + P(`M1260,280 Q1400,300 1480,220`, 12, C.steel2);
  s += weld(790, 590, sd, 1.15);
  return s;
};

M.truck = (sd) => {
  let s = "";
  // box truck
  s += R(180, 320, 820, 440, 10, C.steel, "#1e1d1c", 8);
  s += P(`M1000,440 L1240,440 L1360,560 L1360,760 L1000,760 Z`, 10, C.steel, "#1e1d1c");
  s += P(`M1030,470 L1220,470 L1310,560 L1030,560 Z`, 6, C.steel2, C.glass);
  s += R(180, 640, 820, 26, 0, "none", C.red);
  s += `<text x="590" y="540" text-anchor="middle" font-family="Outfit, 'Inter Display', Inter, Arial" font-weight="800" font-size="78" fill="rgba(228,224,216,0.9)" letter-spacing="4">ANGIR</text><text x="590" y="600" text-anchor="middle" font-family="Outfit, 'Inter Display', Inter, Arial" font-weight="600" font-size="30" fill="rgba(228,224,216,0.55)" letter-spacing="8">MOBILE WELDING</text>`;
  for (const x of [330, 1180]) s += O(x, 790, 70, 12, C.steel, "#141312") + O(x, 790, 26, 8, C.steel2);
  // cylinders + welder on side
  s += R(80, 520, 60, 240, 6, C.steel2, "#232120", 26) + R(40, 600, 40, 160, 6, C.red, "#3a1513", 18);
  s += weld(110, 500, sd, 0.85);
  return s;
};

M.sparks = (sd) => {
  let s = "";
  // cracked plate
  s += R(360, 380, 880, 300, 10, C.steel, "#232120");
  s += poly([[560, 380], [620, 460], [600, 520], [680, 600], [660, 680]], 6, C.red);
  // clock
  s += O(1240, 260, 110, 12, C.steel, "#1b1a19") + L(1240, 260, 1240, 190, 10, C.red) + L(1240, 260, 1300, 290, 10, C.red) + O(1240, 260, 10, 0, C.red, C.red);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; s += L(1240 + Math.cos(a) * 88, 260 + Math.sin(a) * 88, 1240 + Math.cos(a) * 100, 260 + Math.sin(a) * 100, 5, C.steel2); }
  s += weld(620, 500, sd, 1.3);
  return s;
};

M.gaterepair = (sd) => {
  let s = "";
  s += R(160, 260, 70, G - 260, 6, C.steel2, "#232120") + R(1370, 260, 70, G - 260, 6, C.steel2, "#232120");
  // sagging ghost
  s += `<g opacity="0.35" stroke-dasharray="12 14">${P(`M230,360 L1360,420 L1360,${G + 20} L230,${G - 40} Z`, 5, C.steel2)}</g>`;
  // repaired gate
  s += R(230, 340, 1130, G - 380, 12, C.steel);
  s += pickets(270, 1330, 40, () => 346, () => G - 46, 5, C.steel2);
  s += L(230, G - 40, 1360, 340, 14, C.red);
  for (const y of [380, G - 90]) s += R(214, y - 20, 40, 40, 6, C.steel, "#2a2928");
  // wrench
  s += P(`M1180,180 L1420,90`, 22, C.steel2) + O(1440, 82, 34, 12, C.steel2);
  s += weld(234, 380, sd, 0.85);
  return s;
};

M.aluminum = (sd) => {
  let s = "";
  // water
  for (let y = G - 10; y < H; y += 26) s += P(`M0,${y} ${Array.from({ length: 17 }, (_, i) => `Q${i * 100 + 50},${y - 12} ${i * 100 + 100},${y}`).join(" ")}`, 2, "rgba(170,200,215,0.25)");
  // hull
  s += P(`M220,620 L1380,620 L1300,${G - 10} L380,${G - 10} Z`, 10, C.steel, "#1e1d1c");
  s += L(240, 680, 1360, 680, 14, C.red);
  // T-top frame (aluminum tube)
  s += P(`M600,620 L640,300 L1040,300 L1080,620`, 14, C.steel) + P(`M640,300 L600,240 L1080,240 L1040,300`, 10, C.steel2);
  s += R(580, 220, 520, 30, 6, C.steel2, "rgba(228,224,216,0.08)", 6);
  s += L(620, 460, 1060, 460, 10, C.steel);
  s += weld(640, 300, sd, 0.85);
  return s;
};

M.stainless = (sd) => {
  let s = "";
  // two tubes meeting at a mitre
  s += `<linearGradient id="ss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f0ec"/><stop offset="0.5" stop-color="#8f8b84"/><stop offset="1" stop-color="#d9d6d0"/></linearGradient>`;
  s += `<path d="M120,430 L800,430 L800,570 L120,570 Z" fill="url(#ss)" opacity="0.85"/>`;
  s += `<path d="M800,430 L1340,120 L1410,240 L800,570 Z" fill="url(#ss)" opacity="0.75"/>`;
  // heat tint
  s += `<path d="M770,410 L840,410 L860,590 L760,590 Z" fill="rgba(110,80,160,0.25)"/><path d="M740,410 L770,410 L760,590 L730,590 Z" fill="rgba(210,160,60,0.25)"/>`;
  // bead (red highlight)
  let b = ""; for (let y = 430; y <= 570; y += 14) b += `<ellipse cx="800" cy="${y}" rx="18" ry="8" fill="none" stroke="${C.red}" stroke-width="4"/>`; s += b;
  s += weld(800, 440, sd, 0.9);
  return s;
};

M.castiron = (sd) => {
  let s = "";
  s += O(800, 470, 270, 16, C.steel, "#1e1d1c") + O(800, 470, 200, 6, C.steel2);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; s += `<ellipse cx="${n(800 + Math.cos(a) * 130)}" cy="${n(470 + Math.sin(a) * 130)}" rx="56" ry="22" transform="rotate(${n((a * 180) / Math.PI)} ${n(800 + Math.cos(a) * 130)} ${n(470 + Math.sin(a) * 130)})" stroke="${C.steel2}" stroke-width="5" fill="none"/>`; }
  s += O(800, 470, 46, 8, C.steel, "#2a2928");
  // crack + braze bead
  s += poly([[1030, 300], [990, 350], [1010, 400], [960, 450], [985, 500]], 7, C.red);
  let b = ""; for (let t = 0; t < 1; t += 0.12) b += `<circle cx="${n(1030 - 45 * t)}" cy="${n(300 + 200 * t)}" r="9" fill="none" stroke="#d9a441" stroke-width="3"/>`; s += b;
  s += weld(1010, 400, sd, 0.85);
  return s;
};

M.trailer = (sd) => {
  let s = "";
  s += R(360, 520, 900, 40, 10, C.steel, "#262423");
  s += pickets(380, 1240, 60, () => 380, () => 516, 6, C.steel2);
  s += L(360, 380, 1260, 380, 10, C.steel);
  // ramp gate
  s += P(`M1260,560 L1440,${G - 20}`, 14, C.steel) + P(`M1260,380 L1260,560`, 10, C.steel);
  // tongue (red)
  s += P(`M360,560 L160,640 L360,520`, 14, C.red) + O(140, 648, 20, 8, C.red);
  s += O(760, 640, 80, 14, C.steel, "#141312") + O(760, 640, 30, 8, C.steel2);
  s += P(`M640,560 Q760,480 880,560`, 8, C.steel2);
  s += L(160, 660, 160, G, 10, C.steel2);
  s += weld(360, 560, sd, 0.85);
  return s;
};

// ── HERO: Brooklyn row houses, Verrazzano cable, gate, big spark
M.hero = (sd) => {
  let s = "";
  // bridge in distance
  s += `<g stroke="rgba(228,224,216,0.18)" fill="none" stroke-width="4"><line x1="1080" y1="140" x2="1080" y2="560"/><line x1="1480" y1="140" x2="1480" y2="560"/><path d="M700,520 Q1080,140 1080,140 Q1280,420 1480,140 Q1600,320 1700,470"/><line x1="640" y1="560" x2="1700" y2="560" stroke-width="6"/></g>`;
  for (let x = 1100; x < 1470; x += 30) s += L(x, 560, x, 140 + Math.abs(x - 1280) * 1.2, 1.5, "rgba(228,224,216,0.12)");
  // row houses
  const houses = [[0, 360], [200, 330], [400, 380], [600, 340], [1200, 420], [1400, 390]];
  for (const [x, y] of houses) { s += R(x, y, 200, G - y, 4, C.dim, "#141312"); for (let wy = y + 50; wy < G - 120; wy += 110) s += R(x + 30, wy, 50, 70, 3, C.dim) + R(x + 120, wy, 50, 70, 3, C.dim); s += L(x - 6, y, x + 206, y, 10, C.dim); }
  // gate in front
  s += pickets(240, 1360, 36, () => 600, () => G - 8, 6);
  for (let x = 240; x <= 1360; x += 36) s += spear(x, 594, 13);
  s += L(220, 622, 1380, 622, 12, C.red) + L(220, G - 50, 1380, G - 50, 10, C.steel);
  for (const x of [220, 800, 1380]) s += R(x - 20, 560, 40, G - 560, 6, C.steel, "#232120") + ball(x, 542, 20, C.steel);
  s += O(520, 740, 60, 7) + scroll(520, 740, 50, 1.4, 1, 0, 5) + O(1080, 740, 60, 7) + scroll(1080, 740, 50, 1.4, -1, Math.PI, 5);
  s += weld(800, 622, sd, 1.25);
  return s;
};

M.workshop = (sd) => {
  let s = bricks(0, 0, W, G, 40, "rgba(255,255,255,0.05)");
  s += R(300, 200, 1000, G - 200, 14, C.steel2, "#100f0e");
  for (let y = 210; y < 360; y += 30) s += L(310, y, 1290, y, 4, C.steel2); // rolled-up door
  s += R(290, 160, 1020, 40, 6, C.red, "#3a1513");
  s += `<text x="800" y="140" text-anchor="middle" font-family="Outfit, 'Inter Display', Inter, Arial" font-weight="800" font-size="56" fill="rgba(228,224,216,0.85)" letter-spacing="8">ANGIR WELDING &amp; FABRICATION</text>`;
  // bench inside
  s += R(420, 640, 760, 30, 6, C.steel, "#262423") + L(460, 670, 460, G, 10, C.steel) + L(1140, 670, 1140, G, 10, C.steel);
  s += R(520, 560, 120, 80, 6, C.steel2, "#232120") + R(980, 520, 60, 120, 6, C.red, "#3a1513", 18);
  s += weld(760, 630, sd, 1.1);
  return s;
};

M.measure = (sd) => {
  let s = "";
  s += R(240, 200, 1120, 600, 6, "rgba(228,224,216,0.4)");
  s += `<g stroke="rgba(228,224,216,0.5)" stroke-width="3" fill="rgba(228,224,216,0.7)" font-family="Outfit, 'Inter Display', Inter, Arial" font-size="30">
  <line x1="240" y1="160" x2="1360" y2="160"/><line x1="240" y1="140" x2="240" y2="180"/><line x1="1360" y1="140" x2="1360" y2="180"/><text x="740" y="145" stroke="none">12' - 4 1/2"</text>
  <line x1="1400" y1="200" x2="1400" y2="800"/><line x1="1380" y1="200" x2="1420" y2="200"/><line x1="1380" y1="800" x2="1420" y2="800"/><text x="1420" y="510" stroke="none">42"</text></g>`;
  s += pickets(300, 1300, 50, () => 260, () => 760, 5, C.steel);
  s += L(240, 240, 1360, 240, 14, C.red) + L(240, 780, 1360, 780, 10, C.steel);
  s += weld(1300, 240, sd, 0.7);
  return s;
};

// ── Location scenes
const SCENES = {
  brownstone: (r) => { let s = ""; for (let i = 0; i < 6; i++) { const x = 40 + i * 260, y = 220 + r() * 40; s += R(x, y, 250, G - y, 5, C.steel2, "#151413"); s += L(x - 4, y, x + 254, y, 12, C.steel2); for (let wy = y + 50; wy < G - 260; wy += 130) s += R(x + 30, wy, 70, 100, 4, C.dim) + R(x + 150, wy, 70, 100, 4, C.dim); s += P(`M${x + 20},${G} L${x + 140},${G - 180} L${x + 200},${G - 180}`, 6, C.steel); s += L(x + 20, G - 110, x + 140, G - 290, 7, C.red); s += pickets(x + 30, x + 135, 24, (xx) => G - 110 - ((xx - x - 20) / 120) * 180 + 4, (xx) => G - ((xx - x - 20) / 120) * 180 - 4, 3, C.steel2); } return s; },
  detached: (r) => { let s = ""; for (let i = 0; i < 4; i++) { const x = 60 + i * 390, y = 360 + r() * 50; s += P(`M${x},${y} L${x + 160},${y - 140} L${x + 320},${y} L${x + 320},${G} L${x},${G} Z`, 5, C.steel2, "#151413"); s += R(x + 40, y + 60, 80, 90, 4, C.dim) + R(x + 200, y + 60, 80, 90, 4, C.dim) + R(x + 130, G - 160, 60, 160, 4, C.dim); } s += pickets(40, 1560, 30, () => 700, () => G - 6, 5); for (let x = 40; x <= 1560; x += 30) s += spear(x, 694, 11); s += L(20, 716, 1580, 716, 10, C.red) + L(20, G - 40, 1580, G - 40, 8, C.steel); return s; },
  waterfront: (r) => { let s = ""; for (let i = 0; i < 5; i++) { const x = 80 + i * 300, h = 260 + r() * 260; s += R(x, G - 220 - h, 220, h, 5, C.steel2, "#151413"); for (let wy = G - 200 - h; wy < G - 240; wy += 60) s += L(x + 20, wy, x + 200, wy, 3, C.dim); } s += L(0, G - 220, W, G - 220, 10, C.steel) + pickets(0, W, 40, () => G - 330, () => G - 222, 5) + L(0, G - 330, W, G - 330, 12, C.red); for (let y = G - 180; y < H; y += 28) s += P(`M0,${y} ${Array.from({ length: 17 }, (_, i) => `Q${i * 100 + 50},${y - 12} ${i * 100 + 100},${y}`).join(" ")}`, 2, "rgba(170,200,215,0.22)"); return s; },
  industrial: (r) => { let s = ""; s += P(`M60,${G} L60,420 ${Array.from({ length: 7 }, (_, i) => `L${160 + i * 200},300 L${260 + i * 200},420`).join(" ")} L1540,420 L1540,${G}`, 6, C.steel2, "#151413"); for (let i = 0; i < 7; i++) s += R(120 + i * 200, 520, 140, 120, 4, C.dim); s += R(600, 680, 400, 180, 8, C.red, "#2a1110"); for (let y = 690; y < G; y += 20) s += L(610, y, 990, y, 3, C.steel2); s += L(0, 220, 300, 220, 8, C.dim) + L(240, 220, 240, 420, 8, C.dim); return s; },
  mixed: (r) => { let s = ""; for (let i = 0; i < 5; i++) { const x = 40 + i * 310, y = 180 + r() * 80; s += R(x, y, 300, G - y, 5, C.steel2, "#151413"); for (let wy = y + 40; wy < G - 300; wy += 110) for (let wx = x + 30; wx < x + 270; wx += 90) s += R(wx, wy, 60, 80, 3, C.dim); s += R(x + 10, G - 230, 280, 26, 5, C.red, "#3a1513"); for (let gy = G - 200; gy < G - 60; gy += 18) s += L(x + 16, gy, x + 284, gy, 3, C.steel2); const fy = y + 160; s += L(x + 40, fy, x + 260, fy, 6, C.steel) + L(x + 40, fy + 110, x + 260, fy + 110, 6, C.steel) + L(x + 60, fy, x + 240, fy + 110, 4, C.steel2); } return s; },
  towers: (r) => { let s = ""; for (let i = 0; i < 7; i++) { const x = 30 + i * 225, h = 340 + r() * 420; s += R(x, G - h, 200, h, 5, C.steel2, "#151413"); for (let wy = G - h + 30; wy < G - 30; wy += 40) s += L(x + 20, wy, x + 180, wy, 3, "rgba(228,224,216,0.12)"); s += L(x - 10, G - h + 120, x + 210, G - h + 120, 6, C.red); } return s; },
};
const SCENE_FOR = {
  "dyker-heights": "detached", "bay-ridge": "brownstone", "fort-hamilton": "mixed", bensonhurst: "mixed", "bath-beach": "waterfront",
  "borough-park": "mixed", "sunset-park": "industrial", gravesend: "detached", midwood: "detached", "sheepshead-bay": "waterfront",
  "brighton-beach": "waterfront", "coney-island": "waterfront", "marine-park": "detached", canarsie: "detached", flatbush: "brownstone",
  kensington: "brownstone", "windsor-terrace": "brownstone", "park-slope": "brownstone", gowanus: "industrial", "red-hook": "industrial",
  "brooklyn-heights": "brownstone", "downtown-brooklyn": "towers", "fort-greene": "brownstone", "prospect-heights": "brownstone",
  "crown-heights": "brownstone", "bed-stuy": "brownstone", bushwick: "industrial", williamsburg: "towers", greenpoint: "mixed",
  "east-new-york": "detached", "staten-island": "detached", manhattan: "towers", queens: "mixed",
};
function pin(x, y) { return `<g><path d="M${x},${y} C${x - 70},${y - 90} ${x - 60},${y - 170} ${x},${y - 170} C${x + 60},${y - 170} ${x + 70},${y - 90} ${x},${y} Z" fill="${C.red}" stroke="${C.steel}" stroke-width="6"/><circle cx="${x}" cy="${y - 112}" r="22" fill="${C.bg2}"/></g>`; }

// ─────────────────────────────────────────────────────────────
export function motifSVG(key, seedKey = key) {
  const fn = M[key]; if (!fn) throw new Error("No art motif: " + key);
  const sd = hash(seedKey);
  return frame(fn(sd), sd);
}
export function placeSVG(slug, name) {
  const sd = hash(slug); const r = rng(sd);
  const scene = SCENES[SCENE_FOR[slug] || "mixed"](r);
  const label = `${name.toUpperCase()} · ANGIR`;
  const px = Math.round(360 + rng(sd + 7)() * 880);
  return frame(scene + pin(px, 300) + weld(px, 300 - 112, sd, 0.6), sd, { label });
}
export const MOTIFS = Object.keys(M);

// Social share card: art + title text
export function ogSVG(innerSvg, title, kicker) {
  // innerSvg is a full 1600x1000 svg; embed scaled into 1200x630 with overlay text
  const inner = innerSvg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const lines = []; let cur = "";
  for (const w of title.split(" ")) { if ((cur + " " + w).trim().length > 26) { lines.push(cur.trim()); cur = w; } else cur += " " + w; }
  lines.push(cur.trim());
  const tl = lines.slice(0, 3).map((l, i) => `<text x="70" y="${300 + i * 78}" font-family="Outfit, 'Inter Display', Inter, Arial" font-weight="800" font-size="70" fill="#fff">${esc(l)}</text>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<svg x="300" y="-60" width="1100" height="688" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">${inner}</svg>
<defs><linearGradient id="ogfade" x1="0" x2="1"><stop offset="0.25" stop-color="#0c0c0c"/><stop offset="0.75" stop-color="#0c0c0c" stop-opacity="0"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#ogfade)"/>
<rect x="70" y="150" width="70" height="10" fill="${C.red}"/>
<text x="70" y="210" font-family="Outfit, 'Inter Display', Inter, Arial" font-weight="700" font-size="26" letter-spacing="5" fill="rgba(255,255,255,0.7)">${esc(kicker.toUpperCase())}</text>
${tl}
<text x="70" y="575" font-family="Outfit, 'Inter Display', Inter, Arial" font-weight="700" font-size="30" fill="#fff">Angir Welding &amp; Fabrication <tspan fill="${C.red}">·</tspan> <tspan font-weight="500" fill="rgba(255,255,255,0.7)">Brooklyn, NY</tspan></text>
</svg>`;
}

export function logoSVG(size = 512) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
<rect width="512" height="512" rx="96" fill="${C.redDeep}"/>
<path d="M256 92 L408 420 L344 420 L314 352 L198 352 L168 420 L104 420 Z M222 298 L290 298 L256 218 Z" fill="#fff"/>
<rect x="132" y="440" width="248" height="18" rx="9" fill="#fff" opacity="0.9"/>
<circle cx="392" cy="128" r="18" fill="${C.hot}"/><g stroke="${C.hot}" stroke-width="8" stroke-linecap="round"><line x1="392" y1="92" x2="392" y2="70"/><line x1="420" y1="104" x2="438" y2="88"/><line x1="428" y1="132" x2="452" y2="132"/></g>
</svg>`;
}
