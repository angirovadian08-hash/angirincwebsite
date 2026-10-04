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
| About, Contact, FAQ, Privacy, Photo credits, 404 | 6 |

Every page has: unique title + meta description, canonical URL, Open Graph/Twitter image,
LocalBusiness + Service/FAQ/Breadcrumb/Article schema (JSON-LD), and a quote form.
`sitemap.xml`, `robots.txt`, favicon and web manifest are generated too.

**Photos:** professional photography from Unsplash (free for commercial use under the Unsplash License), one hand-picked photo per service, neighborhood and guide — listed with keyword file names and alt text in `src/data/photos.mjs`. By default the site loads them from Unsplash's fast image CDN. Run `npm run photos` (needs internet) to download all of them into `docs/assets/photos/` under their keyword file names, then `npm run build` — the site switches to the local copies automatically. **Best for SEO:** replace them with real photos of Angir jobs — save yours as `FILE-800.webp`, `FILE-1200.webp`, `FILE-1600.webp` using the same file name and rebuild. Photographer credits are on `/credits/`.

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
npm run photos         # optional: download all photos locally with keyword file names
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
