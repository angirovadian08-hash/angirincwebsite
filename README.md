# Angir Welding & Fabrication — website

Static, SEO-optimized website for **Angir Welding & Fabrication, Inc.**, 1363 81st St, Brooklyn, NY 11228.
Modeled on the structure of flood.nyc: service landing pages, neighborhood pages, guides, FAQ, quote forms.

The finished site is in **`docs/`** — plain HTML/CSS/JS, no framework, ready to host anywhere.

## What's inside

| Section | Pages |
|---|---|
| Home | 1 |
| Services (index + 35 service landing pages) | 36 |
| Service areas (index + 30 Brooklyn neighborhoods + Staten Island, Queens, Manhattan) | 34 |
| Guides (index + 6 articles) | 7 |
| About, Contact, FAQ, Privacy, 404 | 5 |

Every page has: unique title + meta description, canonical URL, Open Graph/Twitter image,
LocalBusiness + Service/FAQ/Breadcrumb/Article schema (JSON-LD), and a quote form.
`sitemap.xml`, `robots.txt`, favicon and web manifest are generated too.

**Images:** 78 keyword-named illustrations in 3 sizes (`docs/assets/img/`) and social share cards
(81 cards in `docs/assets/og/`) are generated from `src/art.mjs` in one consistent style (charcoal, steel, deep red, weld sparks).
To swap in a real photo, save it as a 1600×1000 `.webp` with the **same file name** (plus the `-1200` and `-800` sizes).

## ⚠️ Fill these in before launch — `src/data/site.mjs`

- `phoneDisplay` / `phoneHref` — phone number (set to (347) 987-8232)
- `email`
- `url` — the real domain once purchased
- `hours` (optional), `social` links, `licensedInsured` / `licenseNumber` (only if true)
- `formEndpoint` (optional) — a Formspree/Basin URL to receive quote requests by email.
  Left empty, the form opens the visitor's email app addressed to `email`.

Then rebuild:

```bash
npm run build          # rebuilds all HTML into docs/ (no dependencies needed)
npm install && npm run images   # only if you change art or add services/areas (needs sharp)
```

## Editing content

- Services: `src/data/services-a.mjs`, `services-b.mjs`, `services-c.mjs`
- Neighborhoods: `src/data/locations.mjs`
- Guides + general FAQ: `src/data/guides.mjs`
- Design: `src/assets/site.css` · Behavior: `src/assets/site.js` · Page templates: `src/build.mjs`

## Hosting

- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / `/docs`. Add your domain there (it creates a CNAME).
- **Vercel / Netlify:** import the repo; `vercel.json` / `netlify.toml` already point at `docs/`.

After launch: submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console, and add the website URL
and phone number to the Google Business Profile.
