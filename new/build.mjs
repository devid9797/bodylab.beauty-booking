// Генератор страниц НОВОГО дизайна (прототип): главная, запись и страницы процедур на ru / lv / en.
// Цены, описания и FAQ процедур берутся из tools/content.mjs, остальные тексты – из new/i18n.mjs.
//
//   node new/build.mjs
//
// Пишет: new/<lang>/index.html, new/<lang>/zapis/index.html, new/<lang>/<slug>/index.html
// Все пути относительные, поэтому страницы открываются и с сервера, и просто из папки (file://).
// Страницы закрыты от поисковиков (noindex) и не входят в sitemap.
import { SERVICES, UI } from '../tools/content.mjs';
import { LANGS, T, CUR, WA, IG, PHONE } from './i18n.mjs';
import * as QZ from './quiz.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url)); // …/new
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(2, '0');
const SVC = Object.fromEntries(SERVICES.map(s => [s.id, s]));
const HOME_ORDER = ['r-sleek', 'b-flexy', 'ems-zero', 'presoterapija'];

const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.6l1.1-6L3.4 9.4l6-.8z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  done: '<svg viewBox="0 0 24 24" fill="none" stroke="#FFFEFA" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
};
const AURORA = '<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>';
const lcfirst = s => (/^[A-ZА-ЯĀČĒĢĪĶĻŅŠŪŽ][a-zа-яāčēģīķļņšūž]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const money = (L, n) => { const c = CUR[L]; return `${c.pre}${n}${c.suf ? `<small> ${c.suf}</small>` : ''}`; };
const moneyPlain = (L, n) => `${CUR[L].pre}${n}${CUR[L].suf ? ' ' + CUR[L].suf : ''}`;

// ───────── пути (всё относительно файла страницы) ─────────
// page: { L, file }  file – путь страницы от корня сайта, напр. 'new/lv/zapis/index.html'
function paths(page) {
  const dir = posix.dirname(page.file);
  const rel = target => posix.relative(dir, target) || 'index.html';
  const upRel = posix.relative(dir, '.');
  const up = upRel ? upRel + '/' : '';
  return {
    up,
    asset: f => rel(`new/assets/${f}`),
    img: f => rel(`images/${f}`),
    newHome: L2 => rel(`new/${L2}/index.html`),
    newBook: (L2, key) => rel(`new/${L2}/index.html`) + (key ? `?s=${key}` : '') + '#zapis',
    newSvc: (L2, id) => rel(`new/${L2}/${SVC[id].slug[L2]}/index.html`),
    oldHome: L2 => rel(L2 === 'lv' ? 'index.html' : `${L2}/index.html`),
    oldSvc: (L2, id) => rel(`${L2}/${SVC[id].slug[L2]}/index.html`),
    info: () => rel('info/index.html'),
  };
}

// ───────── общие куски ─────────
function head(page, title, extra = '') {
  const { L } = page, t = T[L], p = paths(page);
  return `<!DOCTYPE html>
<html lang="${t.htmlLang}" data-root="${p.up}" data-lb-close="${esc(t.lightbox.close)}" data-lb-prev="${esc(t.lightbox.prev)}" data-lb-next="${esc(t.lightbox.next)}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#F4ECE2">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<link rel="icon" href="${p.img('favicon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p.asset('new.css')}">${extra}
</head>`;
}

// alt(L2) – адрес той же страницы на другом языке
function nav(page, alt, opts = {}) {
  const { L } = page, t = T[L], p = paths(page);
  const langs = LANGS.map(l2 => `<a href="${alt(l2)}"${l2 === L ? ' class="on" aria-current="true"' : ''} hreflang="${l2}">${T[l2].code}</a>`).join('');
  const menuLinks = t.menu.map((m, i) => `
  <a class="m-link" href="${p.newHome(L)}#${t.anchors[i]}">${esc(m)} <small>${pad(i + 1)}</small></a>`).join('');
  const rightBtn = `<a class="btn btn-main btn-sm" href="${page.file === `new/${L}/index.html` ? '#zapis' : p.newBook(L)}">${esc(t.book)}</a>`;
  return `
<header class="nav" id="nav">
  <div class="nav-in">
    <a class="logo" href="${p.newHome(L)}" aria-label="BodyLab.Beauty"><img class="logo-mark nozoom" src="${p.img('logo-mark.png')}" alt="" width="46" height="40"><span class="logo-t">BodyLab<b>.beauty</b></span><sup>${esc(t.city)}</sup></a>
    <div class="nav-r">
      <div class="langs" aria-label="${esc(t.langLabel)}">${langs}</div>
      ${rightBtn}
      <button class="menu-btn" id="menu-btn" type="button" aria-label="${esc(t.menuAria)}" aria-expanded="false" aria-controls="menu"><i></i></button>
    </div>
  </div>
</header>
<nav class="menu" id="menu" aria-label="${esc(t.menuAria)}">${menuLinks}
  <div class="m-foot">
    <a class="btn btn-main" href="${p.newBook(L)}">${esc(t.bookOnline)}</a>
    <a class="btn btn-ghost" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
    <span class="m-langs">${langs}</span>
  </div>
</nav>`;
}

// ═════════════════════════ ЗАПИСЬ (встроена в главную; демо) ═════════════════════════
function bookingBlock(L, p) {
  const t = T[L], b = t.b;
  const OPT = [
    ['r-sleek', 'r-sleek', 45, 35, 'service-rsleek.jpg'],
    ['b-flexy', 'b-flexy', 45, 30, 'service-bflexy.jpg'],
    ['ems-zero-1', 'ems-zero', 30, 20, 'service-emszero.jpg'],
    ['ems-zero-2', 'ems-zero', 60, 35, 'service-emszero.jpg'],
    ['presoterapija', 'presoterapija', 45, 25, 'service-presoterapija.jpg'],
  ].map(([id, svc, min, price, img]) => ({ id, name: b.names[svc] || SVC[svc].name[L], tag: b.opts[id], min, price, img: `images/${img}` }));
  const data = { options: OPT, cur: CUR[L], months: t.months, monthsDate: t.monthsDate, wdShort: t.wdShort, wdFull: t.wdFull, dateFmt: b.dateFmt,
    min: b.min, freeTime: b.freeTime, errReq: b.errReq, errPhone: b.errPhone, toast: b.demoToast, sumDate: b.sumDate, sumTime: b.sumTime, sumSvc: b.sumSvc, sumName: b.sumName };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const html = `
<!-- ЗАПИСЬ -->
<section class="bk inline" id="zapis" data-dock-hide>
  <div class="demo-bar"><i></i>${esc(b.demo)}</div>
  <div class="bk-grid">

    <div class="bk-main" id="bk-main">
      <div class="bk-top">
        <span class="eyebrow rv">${esc(b.eyebrow)}</span>
        <div class="steps rv" style="--d:1" id="steps">
          <button class="stp on" type="button" data-s="1"><b>1</b><span>${esc(b.steps[0])}</span></button>
          <button class="stp" type="button" data-s="2" disabled><b>2</b><span>${esc(b.steps[1])}</span></button>
          <button class="stp" type="button" data-s="3" disabled><b>3</b><span>${esc(b.steps[2])}</span></button>
        </div>
      </div>

      <div class="pane show" id="p1">
        <h2>${esc(b.s1h)}</h2>
        <p class="lead">${esc(b.s1lead)} <a class="link-u" href="#podbor">${esc(t.quizLink[0])}${esc(t.quizLink[1])}</a></p>
        <div class="optgrid" id="optgrid"></div>
        <div class="pane-foot"><button class="btn btn-main" type="button" id="go2" disabled>${esc(b.pickDate)} ${ICON.arrow}</button></div>
      </div>

      <div class="pane" id="p2">
        <h2>${esc(b.s2h)}</h2>
        <p class="lead">${esc(b.s2lead)}</p>
        <div class="cal">
          <div class="cal-h"><h3 id="cal-title"></h3>
            <div class="cal-nav">
              <button type="button" id="cal-prev" aria-label="${esc(b.prev)}">${ICON.prev}</button>
              <button type="button" id="cal-next" aria-label="${esc(b.next)}">${ICON.next}</button>
            </div>
          </div>
          <div class="wd">${t.wdHead.map(x => `<span>${x}</span>`).join('')}</div>
          <div class="days" id="days"></div>
        </div>
        <div class="times-box" id="times-box" hidden>
          <h4 id="times-title"></h4>
          <div class="tg2" id="times"></div>
        </div>
        <div class="pane-foot">
          <button class="btn btn-ghost" type="button" data-back="1">${esc(b.back)}</button>
          <button class="btn btn-main" type="button" id="go3" disabled>${esc(b.toData)} ${ICON.arrow}</button>
        </div>
      </div>

      <div class="pane" id="p3">
        <h2>${esc(b.s3h)}</h2>
        <p class="lead">${esc(b.s3lead)}</p>
        <form class="form" id="form" novalidate>
          <div class="fld"><label for="fn">${esc(b.first)}</label><input id="fn" autocomplete="given-name" placeholder="Anna"></div>
          <div class="fld"><label for="ln">${esc(b.last)}</label><input id="ln" autocomplete="family-name" placeholder="Bērziņa"></div>
          <div class="fld"><label for="ph">${esc(b.phone)}</label><div class="phone"><span class="cc">LV +371</span><input id="ph" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="20000000"></div></div>
          <div class="fld"><label for="ig">${esc(b.ig)}</label><input id="ig" placeholder="@username"></div>
          <div class="fld full"><label for="cm">${esc(b.comment)}</label><textarea id="cm" maxlength="500" placeholder="${esc(b.commentPh)}"></textarea></div>
          <p class="terms">${esc(b.terms)}</p>
          <div class="form-err" id="form-err" role="alert"></div>
        </form>
        <div class="pane-foot">
          <button class="btn btn-ghost" type="button" data-back="2">${esc(b.back)}</button>
          <button class="btn btn-main" type="button" id="submit">${esc(b.submit)} ${ICON.arrow}</button>
        </div>
      </div>

      <div class="pane" id="p4">
        <div class="done-ic">${ICON.done}</div>
        <h2>${esc(b.done)}</h2>
        <p class="lead">${esc(b.doneHint)}</p>
        <div class="confirm" id="confirm"></div>
        <div class="pane-foot">
          <button class="btn btn-main" type="button" data-demo>${esc(b.gcal)}</button>
          <button class="btn btn-ghost" type="button" data-demo>${esc(b.ics)}</button>
        </div>
      </div>
    </div>

    <aside class="sum" id="sum" aria-live="polite">
      ${AURORA}
      <h3>${esc(b.sumTitle)}</h3>
      <div class="srow"><span>${esc(b.sumProc)}</span><span id="s-name"><b class="dash">—</b></span></div>
      <div class="srow"><span>${esc(b.sumDur)}</span><span id="s-min"><b class="dash">—</b></span></div>
      <div class="srow"><span>${esc(b.sumDate)}</span><span id="s-date"><b class="dash">—</b></span></div>
      <div class="srow"><span>${esc(b.sumTime)}</span><span id="s-time"><b class="dash">—</b></span></div>
      <div class="total"><span>${esc(b.sumTotal)}</span><div class="big" id="s-total">${moneyPlain(L, 0)}</div></div>
      <p class="help">${esc(b.help[0])}<a href="${WA}" target="_blank" rel="noopener">${esc(b.help[1])}</a>${esc(b.help[2])}</p>
    </aside>
  </div>
</section>
<div class="toast" id="toast" role="status"></div>`;
  return { html, json };
}

// ═════════════════════════ ТЕСТ «подберите процедуру» ═════════════════════════
function quizBlock(L, p) {
  const t = T[L], q = t.quizUi;
  const ui = UI[L];
  const results = {};
  for (const id of QZ.IDS) {
    const S = SVC[id], key = S.offers.find(o => o.book).book, min = Math.min(...S.offers.map(o => o.price));
    results[id] = {
      name: S.name[L], tag: t.svc[id].tag, img: `images/${S.image.replace('/images/', '')}`, key,
      why: QZ.WHY[id].map(i => S.goals[L][i]), from: S.offers.length > 1,
      price: moneyPlain(L, min), pkg: S.offers.some(o => o.sessions), href: p.newSvc(L, id),
    };
  }
  const data = { ids: QZ.IDS, w: QZ.W, q: QZ.QUIZ[L], results, ui: { ...q, noteExtra: ui.beforeText }, cur: CUR[L] };
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const html = `
<!-- ПОДБОР ПРОЦЕДУРЫ -->
<section class="sec" id="podbor">
  <div class="wrap quiz-wrap">
    <div class="sec-head">
      <span class="eyebrow rv">${esc(q.eyebrow)}</span>
      <h2 class="h-l rv" style="--d:1">${esc(q.h2a)}<span class="em">${esc(q.h2em)}</span></h2>
      <p class="lead rv" style="--d:2">${esc(q.lead)}</p>
    </div>
    <div class="quiz rv" style="--d:3" id="quiz">
      <div class="quiz-start" id="quiz-start"><button class="btn btn-main" type="button" id="quiz-go">${esc(q.start)} ${ICON.arrow}</button></div>
      <div class="quiz-run" id="quiz-run" hidden>
        <div class="quiz-bar" id="quiz-bar"></div>
        <div class="quiz-count" id="quiz-count"></div>
        <h3 class="quiz-q" id="quiz-q"></h3>
        <div class="quiz-opts" id="quiz-opts"></div>
        <button class="btn btn-ghost btn-sm" type="button" id="quiz-back">${esc(q.back)}</button>
      </div>
      <div class="quiz-res" id="quiz-res" hidden></div>
    </div>
  </div>
</section>`;
  return { html, json };
}

// ═════════════════════════ ГЛАВНАЯ ═════════════════════════
const STUDIO = ['studio-3.jpg', 'studio-1.jpg', 'studio-2.jpg', 'building-1.jpg', 'building-2.jpg']; // сюда добавим новые фото студии

function home(L) {
  const t = T[L], page = { L, file: `new/${L}/index.html` }, p = paths(page);
  const alt = l2 => p.newHome(l2);
  const cur = n => money(L, n);
  const bk = bookingBlock(L, p), qz = quizBlock(L, p);

  const win = (id, i) => {
    const s = t.svc[id], S = SVC[id];
    const prices = s.prices.map(([a, b]) => `<div class="pr"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('');
    const chips = s.chips.map((c, k) => `<span class="chip" style="--i:${k}">${esc(c)}</span>`).join('');
    return `
        <article class="win${i === 0 ? ' on' : ''}" data-i="${i}">
          <div class="win-bar"><i></i><i></i><i></i><span>${pad(i + 1)} / 04 · ${esc((S.name[L]).toUpperCase())}</span></div>
          <div class="win-body">
            <div class="win-img"><img src="${p.img(S.image.replace('/images/', ''))}" alt="${esc(S.name[L])}" loading="lazy"><span class="badge">${esc(s.badge)}</span></div>
            <div class="win-txt">
              <h3>${esc(S.name[L])}</h3><div class="tg">${esc(s.tag)}</div>
              <p>${esc(s.desc)}</p>
              <div class="chips">${chips}</div>
              <div class="price-row">${prices}</div>
              <a class="btn btn-main btn-sm" href="${p.newSvc(L, id)}">${esc(t.details)} ${ICON.arrow}</a>
            </div>
          </div>
        </article>`;
  };
  const steps = HOME_ORDER.map((id, i) => `
          <button class="step${i === 0 ? ' on' : ''}" type="button" data-i="${i}">${esc(SVC[id].name[L])}<small>${esc(t.svc[id].tag)}</small></button>`).join('');

  const visit = t.visit.steps.map(([h, tx], i) => {
    const ic = [ICON.chat, ICON.cal, ICON.pin, ICON.clock][i];
    const extra = i === 0 ? ` <a class="link-u" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>` : '';
    return `
      <div class="fcard" style="--i:${i}"><div class="fnum">${pad(i + 1)}</div><div><h3>${esc(h)}</h3><p>${esc(tx)}${extra}</p></div><div class="ficon">${ic}</div></div>`;
  }).join('');

  const pcard = (id, i, hot) => {
    const c = t.prices.cards[id], S = SVC[id], first = S.offers[0];
    const key = S.offers.find(o => o.book).book;
    return `
      <div class="pcard${hot ? ' hot' : ''} rv" style="--d:${i}"><div class="tag">${esc(c.badge)}<span class="pill">${first.minutes} ${esc(t.prices.min)}</span></div><h3>${esc(S.name[L])}</h3><div class="amt">${cur(first.price)}</div><ul>${c.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul><a class="btn ${hot ? 'btn-light' : 'btn-ghost'}" href="#zapis" data-pick="${key}">${esc(t.prices.choose)}</a></div>`;
  };
  const priceOrder = ['b-flexy', 'r-sleek', 'ems-zero', 'presoterapija'];
  const stat = (it, d) => `<div class="stat rv"${d ? ` style="--d:${d}"` : ''}><div class="big">${it.pre ? `<small>${esc(it.pre)}</small>` : ''}<span data-count="${it.n}">${it.n}</span>${it.post ? `<small>${esc(it.post)}</small>` : ''}</div><p>${esc(it.label)}</p></div>`;
  const wa = txt => `${WA}?text=${encodeURIComponent(txt)}`;
  const studio = STUDIO.map((f, i) => `<figure class="sph sph${i + 1}"><img src="${p.img(f)}" alt="${esc(t.studio.alts[i] || t.studio.alts[0])}" loading="lazy"></figure>`).join('');

  return head(page, t.homeTitle) + `
<body>
${nav(page, alt)}

<main id="top">

<!-- HERO -->
<section class="sec hero">
  <div class="wrap">
    ${AURORA}
    <div>
      <span class="live rv"><i></i>${esc(t.live)}</span>
      <h1 class="h-xl">
        <span class="mask" style="--d:0"><span>${esc(t.h1a)}</span></span>
        <span class="mask" style="--d:1"><span>${esc(t.h1b)}<span class="em">${esc(t.h1em)}</span></span></span>
      </h1>
      <p class="lead rv" style="--d:3">${esc(t.heroLead)}</p>
      <div class="cta-row rv" style="--d:4">
        <a class="btn btn-main" href="#zapis">${esc(t.pickTime)} ${ICON.arrow}</a>
        <a class="btn btn-ghost" href="#uslugi">${esc(t.seeTreatments)}</a>
      </div>
    </div>
    <div class="hero-photo rv" style="--d:3">
      <div class="ph" id="hero-ph"><img id="hero-img" src="${p.img('hero.jpg')}" alt="BodyLab.Beauty" width="534" height="800" fetchpriority="high"></div>
      <div class="float-chip fc1"><b>${esc(t.chip1.b)}</b><span>${esc(t.chip1.main)}<small>${esc(t.chip1.small)}</small></span></div>
      <div class="float-chip fc2"><b>${esc(t.chip2.b)}</b><span>${esc(t.chip2.main)}<small>${esc(t.chip2.small)}</small></span></div>
    </div>
  </div>
</section>
${bk.html}
${qz.html}

<div class="strip" aria-hidden="true"><div class="strip-track">
  ${[...t.strip, ...t.strip].map(x => `<span>${esc(x)}</span>`).join('')}
</div></div>

<!-- УСЛУГИ (липкая секция) -->
<section class="pin" id="uslugi" style="--n:4" data-dock-hide>
  <div class="pin-stick">
    <div class="pin-in">
      <div class="pin-l">
        <span class="eyebrow">${esc(t.pin.eyebrow)}</span>
        <h2 class="h-l">${esc(t.pin.h2a)}<span class="em">${esc(t.pin.h2em)}</span></h2>
        <p class="lead">${esc(t.pin.lead)}</p>
        <div class="rail" id="rail">
          <div class="rail-fill"></div>${steps}
        </div>
      </div>
      <div class="stage" id="stage">
${HOME_ORDER.map(win).join('\n')}
      </div>
    </div>
  </div>
</section>

<!-- КАК ПРОХОДИТ ВИЗИТ -->
<section class="sec" id="vizit">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow rv">${esc(t.visit.eyebrow)}</span>
      <h2 class="h-l rv" style="--d:1">${esc(t.visit.h2a)}<span class="em">${esc(t.visit.h2em)}</span></h2>
      <p class="lead rv" style="--d:2">${esc(t.visit.lead)}</p>
    </div>
    <div class="flow" id="flow">${visit}
    </div>
  </div>
</section>

<!-- ЦИФРЫ -->
<section class="sec dark" id="cifry">
  <div class="wrap">
    ${AURORA}
    <div class="sec-head">
      <span class="eyebrow rv">${esc(t.stats.eyebrow)}</span>
      <h2 class="h-l rv" style="--d:1">${esc(t.stats.h2a)}<span class="em">${esc(t.stats.h2em)}</span></h2>
    </div>
    <div class="stats">
      ${t.stats.items.map((it, i) => stat(it, i)).join('\n      ')}
    </div>
  </div>
</section>

<!-- ЦЕНЫ -->
<section class="sec" id="ceny">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow rv">${esc(t.prices.eyebrow)}</span>
      <h2 class="h-l rv" style="--d:1">${esc(t.prices.h2a)}<span class="em">${esc(t.prices.h2em)}</span></h2>
    </div>
    <div class="prices">${priceOrder.map((id, i) => pcard(id, i, id === 'r-sleek')).join('')}
    </div>
    <div class="note rv">${ICON.shield}<span>${esc(t.prices.note)}</span></div>
  </div>
</section>

<!-- ОТЗЫВЫ -->
<section class="sec" id="otzyvy">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow rv">${esc(t.reviews.eyebrow)}</span>
      <h2 class="h-l rv" style="--d:1">${esc(t.reviews.h2a)}<span class="em">${esc(t.reviews.h2em)}</span></h2>
    </div>
    <div class="revs rv" data-gallery="reviews">
      <div class="rev-scroll" id="rev-track" data-alt="${esc(t.reviews.alt)}"></div>
      <div class="rev-ctl">
        <span class="rev-hint">${esc(t.reviewsUi.hint)}</span>
        <div class="cal-nav"><button type="button" id="rev-prev" aria-label="${esc(t.reviewsUi.prev)}">${ICON.prev}</button><button type="button" id="rev-next" aria-label="${esc(t.reviewsUi.next)}">${ICON.next}</button></div>
      </div>
    </div>
  </div>
</section>

<!-- СТУДИЯ -->
<section class="sec" id="studija">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow rv">${esc(t.studio.eyebrow)}</span>
      <h2 class="h-l rv" style="--d:1">${esc(t.studio.h2a)}<span class="em">${esc(t.studio.h2em)}</span></h2>
      <p class="lead rv" style="--d:2">${esc(t.studio.lead)}</p>
    </div>
    <div class="studio rv" data-gallery="studio" style="--d:3">${studio}</div>
  </div>
</section>

<!-- ПОДАРОК + STEBBY -->
<section class="sec" id="podarok">
  <div class="wrap" style="background:transparent;box-shadow:none;padding:0">
    <div class="duo">
      <div class="box gift rv">
        <img src="${p.img('gift-card.jpg')}" alt="${esc(t.gift.alt)}" loading="lazy">
        <div style="display:grid;gap:12px">
          <span class="eyebrow">${esc(t.gift.eyebrow)}</span>
          <h3 class="h-m">${esc(t.gift.title)}</h3>
          <p>${esc(t.gift.desc)}</p>
          <ul>${t.gift.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
          <a class="btn btn-main btn-sm" href="${wa(t.gift.wa)}" target="_blank" rel="noopener">${esc(t.gift.btn)}</a>
        </div>
      </div>
      <div class="box rv" style="--d:1">
        <span class="eyebrow">${esc(t.stebby.eyebrow)}</span>
        <h3 class="h-m">${esc(t.stebby.title)}</h3>
        <p>${esc(t.stebby.desc)}</p>
        <img class="stebby-logo nozoom" src="${p.img('stebby-logo.png')}" alt="Stebby" width="1280" height="307" loading="lazy">
      </div>
    </div>
  </div>
</section>

<!-- КОНТАКТЫ -->
<section class="sec dark" id="kontakty" data-dock-hide>
  <div class="wrap">
    ${AURORA}
    <div class="contact">
      <div>
        <span class="eyebrow rv">${esc(t.contact.eyebrow)}</span>
        <h2 class="h-xl rv" style="--d:1;font-size:clamp(40px,7vw,88px);margin-top:12px">${esc(t.contact.h2a)}<span class="em">${esc(t.contact.h2em)}</span></h2>
        <div class="rows rv" style="--d:2">
          <div class="row"><span>${esc(t.contact.address)}</span><span>${esc(t.contact.addrText)}</span></div>
          <div class="row"><span>${esc(t.contact.phone)}</span><span><a href="tel:+37120888805">${PHONE}</a></span></div>
          <div class="row"><span>Instagram</span><span><a href="${IG}" target="_blank" rel="noopener">@bodylab.beauty</a></span></div>
        </div>
        <div class="cta-row rv" style="--d:3">
          <a class="btn btn-light" href="#zapis">${esc(t.bookOnline)} ${ICON.arrow}</a>
          <a class="btn btn-ghost" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
      <div class="photos rv" style="--d:2" data-gallery="contact"><img src="${p.img('studio-1.jpg')}" alt="${esc(t.contact.imgAlt1)}" loading="lazy"><img src="${p.img('studio-2.jpg')}" alt="${esc(t.contact.imgAlt2)}" loading="lazy"></div>
    </div>
  </div>
</section>

</main>

<footer class="f">
  <span>${esc(t.footer.rights)}</span>
  <span><a href="${p.oldHome(L)}">${esc(t.footer.current)}</a> · <a href="${p.info()}">${esc(t.footer.info)}</a></span>
</footer>

<div class="dock" id="dock"><a class="btn btn-main" href="#zapis">${esc(t.bookOnline)} ${ICON.arrow}</a></div>

<script type="application/json" id="i18n">${bk.json}</script>
<script type="application/json" id="quiz-data">${qz.json}</script>
<script src="${p.asset('new.js')}" defer></script>
<script src="${p.asset('booking.js')}" defer></script>
<script src="${p.asset('quiz.js')}" defer></script>
<script src="${p.asset('home.js')}" defer></script>
</body>
</html>
`;
}

// ═════════════════════════ ПРОЦЕДУРА ═════════════════════════
function service(L, S) {
  const t = T[L], s = t.s, ui = UI[L], id = S.id, name = S.name[L];
  const page = { L, file: `new/${L}/${S.slug[L]}/index.html` }, p = paths(page);
  const alt = l2 => p.newSvc(l2, id);
  const offers = S.offers;
  const mins = [...new Set(offers.map(o => o.minutes))].sort((a, b) => a - b);
  const minPrice = Math.min(...offers.map(o => o.price));
  const bookKey = offers.find(o => o.book).book;
  const hotIdx = offers.length > 1 ? offers.length - 1 : -1;
  const tag = t.svc[id].tag;
  const ph = (n, plain) => (plain ? moneyPlain(L, n) : money(L, n));

  const facts = `
        <div class="facts rv" style="--d:3">
          <span class="fact">${ICON.clock}${mins.join(s.orWord)} ${esc(t.b.min)}</span>
          <span class="fact">${ICON.tag}${offers.length > 1 ? esc(s.from) : ''}${ph(minPrice, true)}</span>
          <span class="fact">${ICON.cal}${esc(s.onlineBook)}</span>
        </div>`;
  const goals = S.goals[L].map((g, i) => `
      <div class="gcard rv" style="--d:${i}"><div class="n pearl">${pad(i + 1)}</div><h3>${esc(g)}</h3></div>`).join('');
  const how = S.how[L].map(x => `<p>${esc(x)}</p>`).join('');
  const offerCards = offers.map((o, i) => {
    const hot = i === hotIdx;
    const per = o.sessions ? `<div class="per">${ph(Math.round(o.price / o.sessions * 100) / 100, true)} ${esc(s.perSession)}</div>` : `<div class="per">${esc(ui.minutes(o.minutes))}</div>`;
    const cta = o.book
      ? `<a class="btn ${hot ? 'btn-light' : 'btn-ghost'}" href="${p.newBook(L, o.book)}">${esc(ui.book(name))}</a>`
      : `<a class="btn ${hot ? 'btn-light' : 'btn-ghost'}" href="${WA}?text=${encodeURIComponent(s.askText(name, lcfirst(o.label[L])))}" target="_blank" rel="noopener">${esc(s.ask)}</a>`;
    return `
      <div class="pcard${hot ? ' hot' : ''} rv" style="--d:${i}">
        <div class="tag">${esc(name)}<span class="pill">${esc(ui.minutes(o.minutes))}</span></div>
        <h3>${esc(o.label[L])}</h3>
        <div class="amt">${ph(o.price)}</div>
        ${per}
        ${cta}
      </div>`;
  }).join('');
  const faq = [...S.faq[L], ui.faqBook, ui.faqCancel, ui.faqPay, ui.faqWhere].map((f, i) => `
        <div class="acc-i rv${i === 0 ? ' open' : ''}" style="--d:${i}">
          <button class="acc-q" type="button" aria-expanded="${i === 0}"><span>${esc(f.q)}</span><i></i></button>
          <div class="acc-a"><div><p>${esc(f.a)}</p></div></div>
        </div>`).join('');
  const others = SERVICES.filter(o => o.id !== id).map((o, i) => {
    const mp = Math.min(...o.offers.map(x => x.price));
    return `
      <a class="ocard rv" style="--d:${i}" href="${p.newSvc(L, o.id)}">
        <img src="${p.img(o.image.replace('/images/', ''))}" alt="${esc(o.name[L])}" loading="lazy" width="96" height="96">
        <div><h3>${esc(o.name[L])}</h3><small>${esc(lcfirst(t.svc[o.id].tag))} · ${o.offers.length > 1 ? esc(s.from) : ''}${ph(mp, true)}</small></div>
        <span class="go">${ICON.arrow}</span>
      </a>`;
  }).join('');

  return head(page, `${S.h1[L]} (${L === 'ru' ? 'новый дизайн' : L === 'lv' ? 'jaunais dizains' : 'new design'})`) + `
<body>
${nav(page, alt)}

<main id="top">

<section class="sec svc-hero">
  <div class="wrap">
    ${AURORA}
    <div>
      <div class="crumbs rv"><a href="${p.newHome(L)}">BodyLab</a><span>/</span><a href="${p.newHome(L)}#uslugi">${esc(s.treatments)}</a><span>/</span><span>${esc(name)}</span></div>
      <h1 class="h-xl">
        <span class="mask" style="--d:0"><span>${esc(name)}</span></span>
        <span class="mask h-sub" style="--d:1"><span><span class="em">${esc(lcfirst(tag))}</span></span></span>
      </h1>
      <p class="lead rv" style="--d:3;margin-top:22px">${esc(S.lead[L])}</p>${facts}
      <div class="cta-row rv" style="--d:4">
        <a class="btn btn-main" href="${p.newBook(L, bookKey)}">${esc(ui.book(name))} ${ICON.arrow}</a>
        <a class="btn btn-ghost" href="${p.newHome(L)}#uslugi">${esc(ui.allTreatments)}</a>
      </div>
    </div>
    <div class="hero-photo rv" style="--d:3">
      <div class="ph"><img id="hero-img" src="${p.img(S.image.replace('/images/', ''))}" alt="${esc(name)}" width="534" height="800" fetchpriority="high"></div>
      <div class="float-chip fc1"><b>${mins[0]}</b><span>${esc(s.min)}<small>${esc(offers.length > 1 || mins.length > 1 ? s.oneSession : s.length)}</small></span></div>
      <div class="float-chip fc2"><b>€</b><span>${offers.length > 1 ? esc(s.from) : ''}${ph(minPrice, true)}<small>${esc(s.price)}</small></span></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="how">
      <div class="sec-head" style="margin:0">
        <span class="eyebrow rv">${esc(s.about)}</span>
        <h2 class="h-l rv" style="--d:1">${esc(ui.howTitle)}</h2>
      </div>
      <div class="rv" style="--d:2">${how}</div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap" style="background:transparent;box-shadow:none;padding:0">
    <div class="sec-head" style="padding:clamp(20px,3vw,40px) clamp(8px,2vw,24px) 0">
      <span class="eyebrow rv">${esc(ui.goalsTitle)}</span>
    </div>
    <div class="goals">${goals}
    </div>
  </div>
</section>

<section class="sec" id="ceny">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow rv">${esc(ui.pricesTitle)}</span>
      <h2 class="h-l rv" style="--d:1">${esc(s.pickVariant)}<span class="em">${esc(s.variantEm)}</span></h2>
    </div>
    <div class="offers">${offerCards}
    </div>
    <div class="note rv">${ICON.shield}<span>${esc(ui.paymentText)} ${esc(ui.faqCancel.a.split('. ').slice(-1)[0])}</span></div>
  </div>
</section>

<section class="sec dark">
  <div class="wrap">
    ${AURORA}
    <div class="how">
      <div class="sec-head" style="margin:0">
        <span class="eyebrow rv">${esc(s.honest)}</span>
        <h2 class="h-l rv" style="--d:1">${esc(ui.expectTitle)}</h2>
      </div>
      <div class="rv" style="--d:2"><p style="color:#CFC7BD">${esc(ui.expectText)}</p><p style="color:#A39C93;font-size:15px;font-weight:500">${esc(ui.beforeText)}</p></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="how">
      <div class="sec-head" style="margin:0">
        <span class="eyebrow rv">${esc(s.faq)}</span>
        <h2 class="h-l rv" style="--d:1">${esc(ui.faqTitle)}</h2>
      </div>
      <div class="acc">${faq}
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap" style="background:transparent;box-shadow:none;padding:0">
    <div class="sec-head" style="padding:clamp(20px,3vw,40px) clamp(8px,2vw,24px) 0">
      <span class="eyebrow rv">${esc(ui.otherTitle)}</span>
    </div>
    <div class="ocards">${others}
    </div>
  </div>
</section>

<section class="sec dark" data-dock-hide>
  <div class="wrap">
    ${AURORA}
    <div class="cta-card">
      <div>
        <span class="eyebrow rv">${esc(s.ctaEyebrow)}</span>
        <h2 class="h-l rv" style="--d:1;margin-top:12px">${esc(s.ctaH2a)}<span class="em">${esc(s.ctaH2em)}</span></h2>
        <p class="lead rv" style="--d:2;margin-top:14px">${esc(s.ctaLead)}</p>
      </div>
      <div class="cta-row rv" style="--d:3;margin:0">
        <a class="btn btn-light" href="${p.newBook(L, bookKey)}">${esc(ui.book(name))} ${ICON.arrow}</a>
        <a class="btn btn-ghost" href="${WA}" target="_blank" rel="noopener">${s.waBtn}</a>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="f">
  <span>${esc(t.footer.rights)}</span>
  <span><a href="${p.oldSvc(L, id)}">${esc(t.footer.thisPage)}</a> · <a href="${p.newHome(L)}">${esc(ui.allTreatments)}</a> · <a href="${p.info()}">${esc(t.footer.info)}</a></span>
</footer>

<div class="dock" id="dock"><a class="btn btn-main" href="${p.newBook(L, bookKey)}">${esc(ui.book(name))} ${ICON.arrow}</a></div>

<script src="${p.asset('new.js')}" defer></script>
</body>
</html>
`;
}

// ───────── запись файлов ─────────
function write(file, html) {
  const full = join(root, '..', file);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  console.log('wrote', file);
}
for (const L of LANGS) {
  write(`new/${L}/index.html`, home(L));
  for (const S of SERVICES) write(`new/${L}/${S.slug[L]}/index.html`, service(L, S));
}
