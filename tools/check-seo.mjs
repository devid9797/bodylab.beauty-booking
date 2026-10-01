#!/usr/bin/env node
// Crawler's-eye check of the built site: fetches raw HTML (no JavaScript) from a
// running server and verifies what search engines / AI crawlers would see.
//
//   node tools/check-seo.mjs [base-url]     default http://127.0.0.1:8766
//
// Live check after deploy: node tools/check-seo.mjs https://bodylab-beauty.lv

import { SITE, LANGS, HOME_PATH, SERVICES, UI } from './content.mjs';

const BASE = (process.argv[2] || 'http://127.0.0.1:8766').replace(/\/$/, '');
let failures = 0;
const fail = (page, msg) => { failures++; console.log(`  ✗ ${page}: ${msg}`); };

const visibleText = html => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<!-- prerender:skip:start -->[\s\S]*?<!-- prerender:skip:end -->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const attr = (html, re) => (html.match(re) || [])[1];

async function get(path) {
  const res = await fetch(BASE + path, { redirect: 'manual' });
  return { status: res.status, html: await res.text(), location: res.headers.get('location'), robotsHeader: res.headers.get('x-robots-tag') };
}

const pages = [];
for (const lang of LANGS) {
  pages.push({ path: HOME_PATH[lang], lang, kind: 'home' });
  for (const svc of SERVICES) pages.push({ path: `/${lang}/${svc.slug[lang]}/`, lang, kind: 'service', svc });
}

const titles = new Map(), descriptions = new Map(), hreflangMap = new Map();

for (const p of pages) {
  const { status, html, robotsHeader } = await get(p.path);
  const label = p.path;
  if (status !== 200) { fail(label, `HTTP ${status}`); continue; }
  if (robotsHeader && /noindex/i.test(robotsHeader)) fail(label, `X-Robots-Tag: ${robotsHeader}`);
  if (/<meta name="robots"[^>]*noindex/i.test(html)) fail(label, 'has noindex');
  if (attr(html, /<html lang="([^"]+)"/) !== p.lang) fail(label, 'wrong <html lang>');

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  if (h1s.length !== 1 || !h1s[0]) fail(label, `expected one non-empty <h1>, got ${JSON.stringify(h1s)}`);

  const title = attr(html, /<title>([^<]+)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]+)"/);
  if (!title || !desc) fail(label, 'missing title/description');
  if (titles.has(title)) fail(label, `duplicate title with ${titles.get(title)}`); titles.set(title, label);
  if (descriptions.has(desc)) fail(label, `duplicate description with ${descriptions.get(desc)}`); descriptions.set(desc, label);

  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  if (canonical !== SITE + p.path) fail(label, `canonical ${canonical}`);
  if (attr(html, /<meta property="og:url" content="([^"]+)"/) !== SITE + p.path) fail(label, 'og:url mismatch');

  const alts = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2]]));
  for (const l of [...LANGS, 'x-default']) if (!alts[l]) fail(label, `hreflang ${l} missing`);
  if (alts[p.lang] !== SITE + p.path) fail(label, 'hreflang does not include itself');
  hreflangMap.set(SITE + p.path, alts);

  // JSON-LD parses and matches the visible page
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let graph = [];
  try { graph = blocks.flatMap(b => JSON.parse(b[1])['@graph'] || []); } catch (e) { fail(label, `JSON-LD invalid: ${e.message}`); }
  const salon = graph.find(n => n['@type'] === 'BeautySalon');
  if (!salon || salon['@id'] !== `${SITE}/#salon`) fail(label, 'BeautySalon @id missing');

  const text = visibleText(html);
  for (const must of ['Augusta Deglava iela 66', '20888805']) if (!text.includes(must)) fail(label, `visible text lacks "${must}"`);
  if (/2700#/.test(text)) fail(label, 'parking gate code visible in page text');
  if (/\{\{|TODO|lorem/i.test(text)) fail(label, 'template placeholder in text');

  const pageBody = html.replace(/<!-- prerender:skip:start -->[\s\S]*?<!-- prerender:skip:end -->/g, '');
  const emptyLinks = [...pageBody.matchAll(/<a\b([^>]*)>\s*<\/a>/g)].filter(m => !/aria-label=/.test(m[1]));
  if (emptyLinks.length) fail(label, `${emptyLinks.length} link(s) without text, e.g. ${emptyLinks[0][0].slice(0, 90)}`);
  const emptyI18n = [...pageBody.matchAll(/<([a-z0-9]+)\b(?:(?!data-i18n-attr)[^>])*\sdata-i18n="([^"]+)"(?:(?!data-i18n-attr)[^>])*>\s*<\/\1>/g)];
  if (emptyI18n.length) fail(label, `untranslated: ${emptyI18n.map(m => m[2]).join(', ')}`);
  const hrefs = [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map(m => m[1]);
  if (p.kind === 'home') {
    for (const svc of SERVICES) if (!hrefs.includes(`/${p.lang}/${svc.slug[p.lang]}/`)) fail(label, `no link to ${svc.id} page`);
    for (const price of ['35€', '330€', '30€', '280€', '20€', '25€']) if (!text.includes(price)) fail(label, `price ${price} not in HTML`);
  } else {
    const svc = p.svc;
    if (!hrefs.includes(HOME_PATH[p.lang])) fail(label, 'no link to home');
    if (!hrefs.some(h => h.startsWith(`${HOME_PATH[p.lang]}?book=`))) fail(label, 'no booking link');
    for (const o of SERVICES.filter(s => s !== svc)) if (!hrefs.includes(`/${p.lang}/${o.slug[p.lang]}/`)) fail(label, `no link to related ${o.id}`);
    const service = graph.find(n => n['@type'] === 'Service');
    if (!service || service.provider?.['@id'] !== `${SITE}/#salon`) fail(label, 'Service not linked to salon @id');
    for (const o of service?.offers || []) {
      const shown = p.lang === 'en' ? `€${o.price}` : `${o.price} €`;
      if (o.priceCurrency !== 'EUR' || !text.includes(shown)) fail(label, `offer price ${o.price} not visible`);
    }
    const faq = graph.find(n => n['@type'] === 'FAQPage');
    for (const q of faq?.mainEntity || []) if (!text.includes(q.name)) fail(label, `FAQ "${q.name}" not visible`);
    const minutes = UI[p.lang].minutes(svc.offers[0].minutes);
    if (!text.includes(minutes)) fail(label, `duration ${minutes} not visible`);
  }
  console.log(`  ✓ ${label}  (${h1s[0]})`);
}

// hreflang must be reciprocal
for (const [url, alts] of hreflangMap) {
  for (const [l, target] of Object.entries(alts)) {
    if (l === 'x-default') continue;
    const back = hreflangMap.get(target);
    if (!back || back[LANGS.find(x => back[x] === target)] !== target || !Object.values(back).includes(url)) fail(url, `hreflang ${l} not reciprocal`);
  }
}

// sitemap = exactly the canonical pages
const sm = (await get('/sitemap.xml')).html;
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).sort();
const expected = pages.map(p => SITE + p.path).sort();
if (JSON.stringify(locs) !== JSON.stringify(expected)) fail('/sitemap.xml', `locs differ from canonical pages\n${locs.join('\n')}`);
const smUrls = [...sm.matchAll(/(?:<loc>|href=")([^<"]+)/g)].map(m => m[1]);
if (smUrls.some(u => /rsvp|\?/.test(u))) fail('/sitemap.xml', 'contains a private/service URL');

// robots.txt keeps search + AI search crawlers allowed
const robots = (await get('/robots.txt')).html;
if (!/User-agent: \*\s+Allow: \//.test(robots) || /Disallow: \/\s*$/m.test(robots)) fail('/robots.txt', 'does not allow all crawlers');
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('/robots.txt', 'sitemap line missing');

// service routes
const lvRoot = await get('/lv/');
if (!lvRoot.html.includes('url=/"') && !lvRoot.html.includes('content="0; url=/"')) fail('/lv/', 'does not redirect to /');
const missing = await get('/no-such-page/');
if (missing.status !== 404) fail('/no-such-page/', `expected 404, got ${missing.status}`);

console.log(failures ? `\n${failures} problem(s)` : `\nall checks passed (${pages.length} pages)`);
process.exit(failures ? 1 : 0);
