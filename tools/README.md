# Site build

The site is static (GitHub Pages). Texts are prerendered into the HTML so search
engines and AI crawlers see them without running JavaScript.

Edit:
- `index.html` – layout, CSS, booking app, `I18N` texts (LV/RU/EN)
- `tools/content.mjs` – page titles/descriptions, service pages (prices, FAQ)
- `assets/site.js` – shared JS (traffic source, Google tag + consent, language switch)

Then run:

    node tools/build.mjs          # regenerate pages, sitemap.xml, llms.txt
    node tools/build.mjs --check  # verify nothing is out of date

Never hand-edit generated files: `ru/`, `en/`, `lv/`, `404.html`, `sitemap.xml`,
`llms.txt`, and the `seo:head` block / prerendered texts in `index.html`.

Local preview (bookings are simulated on localhost – nothing reaches Make.com):

    python3 -m http.server 8766 --bind 127.0.0.1
    node tools/check-seo.mjs                          # crawler's-eye checks
    node tools/check-seo.mjs https://bodylab-beauty.lv  # same checks on the live site

URLs: `/` = Latvian home (also serves `?rsvp=1` and UTM links), `/ru/`, `/en/`,
`/<lang>/<service>/` service pages, `/lv/` redirects to `/`.
