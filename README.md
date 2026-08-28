# Karina — landing page

Static site, no build step. Three language versions: `index.html` (EN), `index-uk.html` (UK), `index-ru.html` (RU). Shared `css/styles.css` and `js/main.js`.

## Preview locally

Just open `index.html` in a browser, or run a tiny local server (optional, avoids some browser quirks):

```
npx serve .
```

## Editing content

Each language is a separate plain HTML file — open it in any editor and change the text between tags. There's no CMS/admin panel by design (see project scope). The same edit (e.g. a price change) needs to be repeated in all three files if it applies to every language.

To swap a placeholder photo: replace the file in `images/` (keep the same filename, or update the `src=` in all three HTML files).

## Before launch — checklist

1. **Buy a domain** and point it at your host (see Deploy below).
2. **Formspree**: sign up free at [formspree.io](https://formspree.io), create a form, copy its ID, and replace `YOUR_FORM_ID` in the `<form action="...">` line — it appears once in each of the 3 HTML files.
3. **Replace placeholder content**: real photos (`images/hero.svg`, `images/gallery-1..4.svg`, `images/og-cover.svg` — can stay SVG or be swapped for real JPG/PNG, just update the `src=`/`content=` references), real phone number, real Telegram/Instagram links (search each file for `REPLACE`), real prices/bio text.
4. **Replace `REPLACE-WITH-DOMAIN.com`** with the real domain — it appears in `<link rel="canonical">`, `hreflang` tags, Open Graph tags, the JSON-LD blocks, `sitemap.xml`, and `robots.txt` (search-and-replace across all files).
5. **Turn on search indexing** (it's deliberately OFF during development):
   - In each of the 3 HTML files, delete the line `<meta name="robots" content="noindex, nofollow">`
   - In `robots.txt`, delete the `Disallow: /` block and uncomment the `Allow: /` + `Sitemap:` lines at the bottom
6. **Meta Pixel**: once the Meta Ads account is set up, paste the Pixel base code where the `<!-- TODO: paste Meta Pixel base code here -->` comment is in each of the 3 HTML files.

## Deploy (free hosting)

**Netlify** (recommended, easiest):
1. Sign up at [netlify.com](https://netlify.com)
2. Drag-and-drop the whole `karina-landing` folder onto the Netlify dashboard, or connect the GitHub repo for auto-deploy on every push
3. Netlify gives you a free `something.netlify.app` URL immediately
4. To use a real domain: Netlify dashboard → Domain settings → Add custom domain → follow the DNS instructions it shows you

**GitHub Pages** (alternative): push this repo to GitHub, then in the repo Settings → Pages, set the source to the `main` branch root. Free `username.github.io/karina-landing` URL, custom domain supported the same way.

## SEO — after the domain is live (external steps, not code)

These are manual, one-time, done through your own accounts — not something that can be scripted:

1. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)) — add the domain, verify ownership (HTML tag or DNS), submit `sitemap.xml`
2. **Google Analytics** (optional but recommended) — create a GA4 property, add the tracking snippet to all 3 HTML files
3. List the site in a couple of relevant psychologist/therapy directories (e.g. Psychology Today, local directories) for backlinks
4. Meta Ads setup (Instagram + Threads) — separate from SEO, see the project scope doc for what's included
