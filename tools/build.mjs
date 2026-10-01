#!/usr/bin/env node
// Static prerender for bodylab-beauty.lv (GitHub Pages, no server).
//
//   node tools/build.mjs          regenerate every generated file
//   node tools/build.mjs --check  exit 1 if any generated file is out of date
//
// Source of truth:
//   index.html          the page + booking app (layout, CSS, JS, I18N dictionary)
//   tools/content.mjs   SEO metadata and the service pages' content
//
// Generated (do not edit by hand):
//   index.html (LV, prerendered in place), ru/index.html, en/index.html,
//   <lang>/<service>/index.html, lv/index.html (redirect to /), 404.html,
//   sitemap.xml, llms.txt
//
// Prerendering = the I18N texts are written straight into the HTML, so search
// engines and AI crawlers that don't run JavaScript see the real content. The
// page's JS still runs on top of it exactly as before.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import {
  SITE, SALON_ID, LANGS, DEFAULT_LANG, BUSINESS, HOME_PATH, HOME_META, UI, SERVICES,
} from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

// ---------- helpers ----------
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = path => SITE + path;
const servicePath = (svc, lang) => `/${lang}/${svc.slug[lang]}/`;
const euro = (n, lang) => lang === 'en' ? `€${n}` : `${n} €`;
const jsonLd = obj => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/</g, '\\u003c')}\n</script>`;

function replaceBetween(s, start, end, inner) {
  const a = s.indexOf(start);
  const b = s.indexOf(end, a);
  if (a === -1 || b === -1) throw new Error(`markers not found: ${start}`);
  return s.slice(0, a + start.length) + inner + s.slice(b);
}

// ---------- read sources ----------
const template = readFileSync(join(ROOT, 'index.html'), 'utf8');
const css = template.match(/<style>[\s\S]*?<\/style>/)[0];

const i18nStart = template.indexOf('const I18N = {');
const i18nEnd = template.indexOf('\n  };\n', i18nStart);
const I18N = vm.runInNewContext('(' + template.slice(i18nStart + 'const I18N = '.length, i18nEnd + 4) + ')');
for (const lang of LANGS) if (!I18N[lang]) throw new Error(`I18N.${lang} missing`);

// ---------- <head> SEO block ----------
function alternates(pathByLang, xDefaultPath) {
  return LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${abs(pathByLang[l])}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${abs(xDefaultPath)}">`)
    .join('\n');
}

function headBlock({ lang, title, description, path, pathByLang, xDefault, ogType = 'website', image = BUSINESS.image, ld }) {
  const locales = { lv: 'lv_LV', ru: 'ru_RU', en: 'en_GB' };
  return `
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(path)}">
${alternates(pathByLang, xDefault)}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${BUSINESS.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:locale" content="${locales[lang]}">
${LANGS.filter(l => l !== lang).map(l => `<meta property="og:locale:alternate" content="${locales[l]}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
${jsonLd(ld)}
`;
}

// One business entity, referenced from every page by its @id.
function salonNode(lang) {
  return {
    '@type': 'BeautySalon',
    '@id': SALON_ID,
    name: BUSINESS.name,
    url: SITE + '/',
    image: BUSINESS.image,
    logo: BUSINESS.logo,
    telephone: BUSINESS.phone,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressCountry: BUSINESS.country,
    },
    sameAs: [BUSINESS.instagram],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: { lv: 'Procedūras', ru: 'Процедуры', en: 'Treatments' }[lang],
      itemListElement: SERVICES.flatMap(svc => svc.offers.map(o => ({
        '@type': 'Offer',
        name: `${svc.name[lang]} – ${o.label[lang]}`,
        price: o.price,
        priceCurrency: 'EUR',
        itemOffered: { '@id': `${abs(servicePath(svc, lang))}#service` },
      }))),
    },
  };
}

function serviceNode(svc, lang) {
  return {
    '@type': 'Service',
    '@id': `${abs(servicePath(svc, lang))}#service`,
    name: svc.name[lang],
    description: svc.lead[lang],
    url: abs(servicePath(svc, lang)),
    image: abs(svc.image),
    provider: { '@id': SALON_ID },
    areaServed: { '@type': 'City', name: { lv: 'Rīga', ru: 'Рига', en: 'Riga' }[lang] },
    offers: svc.offers.map(o => ({
      '@type': 'Offer',
      name: o.label[lang],
      description: `${o.label[lang]}, ${UI[lang].minutes(o.minutes)}`,
      price: o.price,
      priceCurrency: 'EUR',
      url: abs(servicePath(svc, lang)),
    })),
  };
}

// ---------- prerender the I18N texts into a home page ----------
function fillI18n(html, dict) {
  // data-i18n-attr: the text goes into an attribute (aria-label etc.)
  html = html.replace(/<([a-z][a-z0-9]*)\b([^>]*?)\sdata-i18n="([^"]+)"([^>]*?)\sdata-i18n-attr="([^"]+)"([^>]*)>/g,
    (m, tag, a, key, b, attr, c) => {
      if (dict[key] == null) return m;
      let attrs = `${a} data-i18n="${key}"${b} data-i18n-attr="${attr}"${c}`;
      const re = new RegExp(`\\s${attr}="[^"]*"`);
      attrs = re.test(attrs) ? attrs.replace(re, ` ${attr}="${esc(dict[key])}"`) : `${attrs} ${attr}="${esc(dict[key])}"`;
      return `<${tag}${attrs}>`;
    });
  // element content (data-i18n-html keeps markup such as <br>)
  // (opening tags carrying data-i18n-attr are excluded from the match itself, so
  // their children - e.g. links inside a <nav aria-label> - still get filled)
  return html.replace(/<([a-z][a-z0-9]*)\b((?:(?!data-i18n-attr)[^>])*\sdata-i18n="([^"]+)"(?:(?!data-i18n-attr)[^>])*)>([\s\S]*?)<\/\1>/g,
    (m, tag, attrs, key, inner) => {
      if (dict[key] == null) return m;
      if (new RegExp(`<${tag}\\b`).test(inner)) throw new Error(`nested <${tag}> inside data-i18n="${key}"`);
      const val = /\sdata-i18n-html\b/.test(attrs) ? dict[key] : esc(dict[key]);
      return `<${tag}${attrs}>${val}</${tag}>`;
    });
}

function prerender(html, dict) {
  // The booking sheet is app state, not page content: left for the JS.
  const parts = html.split(/(<!-- prerender:skip:start -->[\s\S]*?<!-- prerender:skip:end -->)/);
  return parts.map(p => p.startsWith('<!-- prerender:skip:start -->') ? p : fillI18n(p, dict)).join('');
}

function setLangSwitch(html, lang, hrefByLang) {
  html = html.replace(/(<a class="lang-option)( active)?(" data-lang="(lv|ru|en)" hreflang="\4" lang="\4" href=")[^"]*(")/g,
    (m, a, _active, b, l, c) => `${a}${l === lang ? ' active' : ''}${b}${hrefByLang[l]}${c}`);
  return html.replace(/(<span id="lang-current">)[^<]*(<\/span>)/, `$1${lang.toUpperCase()}$2`);
}

function renderHome(lang) {
  const meta = HOME_META[lang];
  let html = template.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  html = replaceBetween(html, '<!-- seo:head:start (generated by tools/build.mjs from tools/content.mjs - edit there) -->', '<!-- seo:head:end -->',
    headBlock({
      lang, title: meta.title, description: meta.description,
      path: HOME_PATH[lang], pathByLang: HOME_PATH, xDefault: HOME_PATH[DEFAULT_LANG],
      ld: { '@context': 'https://schema.org', '@graph': [
        salonNode(lang),
        { '@type': 'WebPage', '@id': abs(HOME_PATH[lang]) + '#webpage', url: abs(HOME_PATH[lang]), name: meta.title, inLanguage: lang, about: { '@id': SALON_ID } },
      ] },
    }));
  html = prerender(html, I18N[lang]);
  html = html.replace(/(<a[^>]*\sdata-page="([a-z-]+)"[^>]*\shref=")[^"]*(")/g, (m, a, id, b) => {
    const svc = SERVICES.find(s => s.id === id);
    if (!svc) throw new Error(`unknown data-page ${id}`);
    return a + servicePath(svc, lang) + b;
  });
  return setLangSwitch(html, lang, HOME_PATH);
}

// ---------- service pages ----------
const homes = Object.fromEntries(LANGS.map(l => [l, renderHome(l)]));
function partial(lang, name) {
  const html = homes[lang];
  const a = html.indexOf(`<!-- partial:${name}:start -->`);
  const b = html.indexOf(`<!-- partial:${name}:end -->`);
  if (a === -1 || b === -1) throw new Error(`partial ${name} not found`);
  // in-page anchors of the home page must point back to it
  return html.slice(a, b + `<!-- partial:${name}:end -->`.length).replace(/href="#/g, `href="${HOME_PATH[lang]}#`);
}
const CHEVRON_LEFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
const GRID_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>';

const ICONS = template.match(/<link rel="icon"[^>]*>\n<link rel="apple-touch-icon"[^>]*>/)[0];
const FONTS = template.match(/<link rel="preconnect" href="https:\/\/fonts.googleapis.com">[\s\S]*?rel="stylesheet">/)[0];
const LANG_SWITCH_TOGGLE = template.match(/<button class="lang-toggle"[\s\S]*?<\/button>/)[0];

function renderService(svc, lang) {
  const ui = UI[lang];
  const home = HOME_PATH[lang];
  const name = svc.name[lang];
  const path = servicePath(svc, lang);
  const pathByLang = Object.fromEntries(LANGS.map(l => [l, servicePath(svc, l)]));
  const bookHref = key => `${home}?book=${key}#calendar-card`;
  const faq = [...svc.faq[lang], ui.faqBook, ui.faqCancel, ui.faqPay, ui.faqWhere];
  const others = SERVICES.filter(s => s !== svc);

  const ld = { '@context': 'https://schema.org', '@graph': [
    serviceNode(svc, lang),
    salonNode(lang),
    { '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ] };

  const langMenu = LANGS.map(l =>
    `<a class="lang-option${l === lang ? ' active' : ''}" data-lang="${l}" hreflang="${l}" lang="${l}" href="${pathByLang[l]}">${l.toUpperCase()}</a>`).join('\n          ');

  const rows = svc.offers.map(o => `<tr><td>${esc(o.label[lang])}</td><td>${o.sessions ? `${o.sessions} × ` : ''}${ui.minutes(o.minutes)}</td><td>${euro(o.price, lang)}</td></tr>`).join('\n          ');
  const bookable = svc.offers.filter(o => o.book);
  const bookButtons = bookable.length > 1
    ? bookable.map(o => `<a class="btn btn-primary" href="${bookHref(o.book)}">${esc(ui.bookVariant(`${o.label[lang]} (${ui.minutes(o.minutes)})`))}</a>`).join('\n      ')
    : `<a class="btn btn-primary" href="${bookHref(bookable[0].book)}">${esc(ui.book(name))}</a>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#F4ECE2">
<!-- generated by tools/build.mjs from tools/content.mjs - edit there -->
${headBlock({ lang, title: svc.meta[lang].title, description: svc.meta[lang].description, path, pathByLang, xDefault: pathByLang[DEFAULT_LANG], ogType: 'article', image: abs(svc.image), ld }).trim()}
${ICONS}
${FONTS}
${css}
</head>
<body class="service-page">
<div class="wrap">
  <header class="page-top">
    <a class="back-pill" href="${home}">${CHEVRON_LEFT}<img src="/images/logo.jpg" alt="BodyLab.Beauty" width="30" height="30"><span>${esc(ui.allTreatments)}</span></a>
    <div class="lang-switch" id="lang-switch">
      ${LANG_SWITCH_TOGGLE.replace(/(<span id="lang-current">)[^<]*/, `$1${lang.toUpperCase()}`)}
      <div class="lang-menu" id="lang-menu" aria-label="${esc(ui.langLabel)}">
          ${langMenu}
      </div>
    </div>
  </header>

  <main>
  <section class="card service-hero">
    <img class="service-hero-photo" src="${svc.image}" alt="${esc(name)} – BodyLab.Beauty" width="800" height="600">
    <div class="service-hero-body">
      <h1>${esc(svc.h1[lang])}</h1>
      <p class="service-lead">${esc(svc.lead[lang])}</p>
      <a class="btn btn-primary" href="${bookHref(bookable[0].book)}">${esc(ui.book(name))}</a>
    </div>
  </section>

  <section class="card content-card">
    <h2>${esc(ui.howTitle)}</h2>
    ${svc.how[lang].map(p => `<p>${esc(p)}</p>`).join('\n    ')}
  </section>

  <section class="card content-card">
    <h2>${esc(ui.goalsTitle)}</h2>
    <ul class="service-effects">
      ${svc.goals[lang].map(g => `<li>${esc(g)}</li>`).join('\n      ')}
    </ul>
  </section>

  <section class="card content-card">
    <h2>${esc(ui.expectTitle)}</h2>
    <p>${esc(ui.expectText)}</p>
    <p>${esc(ui.beforeText)}</p>
  </section>

  <section class="card content-card" id="cenas">
    <h2>${esc(ui.pricesTitle)}</h2>
    <table class="price-table">
      <thead><tr><th>${esc(ui.colOption)}</th><th>${esc(ui.colDuration)}</th><th>${esc(ui.colPrice)}</th></tr></thead>
      <tbody>
          ${rows}
      </tbody>
    </table>
    <p style="margin-top:12px">${esc(ui.paymentText)}</p>
    ${bookButtons}
  </section>

  <section class="card content-card">
    <h2>${esc(ui.faqTitle)}</h2>
    ${faq.map(f => `<div class="faq-item"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('\n    ')}
  </section>

  ${partial(lang, 'directions')}
  </main>

  <nav class="card content-card" aria-label="${esc(ui.otherTitle)}">
    <h2>${esc(ui.otherTitle)}</h2>
    <div class="related-links">
      ${others.map(o => `<a href="${servicePath(o, lang)}">${esc(o.name[lang])}</a>`).join('\n      ')}
    </div>
    <a class="btn btn-outline home-btn" href="${home}">${GRID_ICON}${esc(ui.backHome)}</a>
  </nav>

  ${partial(lang, 'footer')}
</div>
<script src="/assets/site.js"></script>
</body>
</html>
`;
}

// ---------- small generated files ----------
function redirectPage(target, lang) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>BodyLab.Beauty</title>
<link rel="canonical" href="${abs(target)}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head>
<body><a href="${target}">BodyLab.Beauty</a></body>
</html>
`;
}

function notFoundPage() {
  const links = LANGS.map(l => `<li><a href="${HOME_PATH[l]}" hreflang="${l}">${{ lv: 'Uz sākumlapu', ru: 'На главную', en: 'Go to the home page' }[l]}</a></li>`).join('\n    ');
  return `<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>404 – BodyLab.Beauty</title>
${ICONS}
${FONTS}
${css}
</head>
<body>
<div class="wrap">
  <main class="card content-card" style="text-align:center">
    <h1>404</h1>
    <p>Lapa nav atrasta · Страница не найдена · Page not found</p>
    <ul style="list-style:none;margin-top:12px;line-height:2">
    ${links}
    </ul>
  </main>
</div>
</body>
</html>
`;
}

function sitemap() {
  const groups = [HOME_PATH, ...SERVICES.map(svc => Object.fromEntries(LANGS.map(l => [l, servicePath(svc, l)])))];
  const urls = groups.flatMap(byLang => LANGS.map(lang => `  <url>
    <loc>${abs(byLang[lang])}</loc>
${LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(byLang[l])}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(byLang[DEFAULT_LANG])}"/>
  </url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

function llms() {
  const svcLines = lang => SERVICES.map(svc =>
    `- [${svc.name[lang]}](${abs(servicePath(svc, lang))}): ${svc.offers.map(o => `${o.label[lang]}, ${UI[lang].minutes(o.minutes)} – ${euro(o.price, lang)}`).join('; ')}`).join('\n');
  return `# BodyLab.Beauty

> Body contouring studio in Riga, Latvia (ķermeņa modelēšanas studija Rīgā). Treatments: R-Sleek, B-Flexy, EMS Zero, pressotherapy. Online booking with live availability.

- Address: Augusta Deglava iela 66, "Deglava Biroji", 5th floor, room 506, Rīga, Latvia
- Phone / WhatsApp: ${BUSINESS.phoneDisplay}
- Instagram: ${BUSINESS.instagram}
- Payment with Stebby wellness benefits is accepted; gift cards are available (valid 3 months).
- Cancellation less than 24 hours before the appointment: the full price applies.

## Treatments (English)
${svcLines('en')}

## Procedūras (latviski)
${svcLines('lv')}

## Процедуры (по-русски)
${svcLines('ru')}

## Pages
- [Home, booking (LV)](${abs(HOME_PATH.lv)})
- [Home, booking (RU)](${abs(HOME_PATH.ru)})
- [Home, booking (EN)](${abs(HOME_PATH.en)})
`;
}

// ---------- write ----------
const outputs = new Map();
for (const lang of LANGS) {
  outputs.set(lang === DEFAULT_LANG ? 'index.html' : `${lang}/index.html`, renderHome(lang));
  for (const svc of SERVICES) outputs.set(`${lang}/${svc.slug[lang]}/index.html`, renderService(svc, lang));
}
outputs.set('lv/index.html', redirectPage('/', 'lv'));
outputs.set('404.html', notFoundPage());
outputs.set('sitemap.xml', sitemap());
outputs.set('llms.txt', llms());

let stale = 0;
for (const [file, content] of outputs) {
  const full = join(ROOT, file);
  const current = existsSync(full) ? readFileSync(full, 'utf8') : null;
  if (current === content) continue;
  if (CHECK) { console.error(`out of date: ${file}`); stale++; continue; }
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  console.log(`wrote ${file}`);
}
if (CHECK && stale) { console.error(`${stale} file(s) out of date - run: node tools/build.mjs`); process.exit(1); }
if (CHECK) console.log(`all ${outputs.size} generated files up to date`);
