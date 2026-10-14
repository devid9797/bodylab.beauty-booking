// Генератор страниц процедур для НОВОГО дизайна (прототип).
// Цены, тексты и FAQ берутся из tools/content.mjs – так данные не расходятся с основным сайтом.
//
//   node new/build.mjs
//
// Пишет: new/ru/<slug>/index.html для каждой процедуры. Эти страницы под noindex.
import { SERVICES, UI } from '../tools/content.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const L = 'ru', ui = UI[L];
const WA = 'https://wa.me/37120888805';

// Короткие подзаголовки – те же, что уже опубликованы на главной странице (I18N rsleek_tagline и т.д.)
const TAGLINE = { 'r-sleek': 'массаж моделирования тела', 'b-flexy': 'вакуумно-роликовый массаж', 'ems-zero': 'EMS-стимуляция мышц', 'presoterapija': 'прессотерапия и лимфодренаж' };

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const TAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>';
const CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(2, '0');
const bookHref = key => `/new/ru/zapis/?s=${key}`;

const NAV = `
<header class="nav" id="nav">
  <div class="nav-in">
    <a class="logo" href="/new/ru/" aria-label="BodyLab.Beauty">BodyLab<sup>/beauty</sup></a>
    <div class="nav-r">
      <a class="btn btn-main btn-sm" href="/new/ru/zapis/">Записаться</a>
      <button class="menu-btn" id="menu-btn" type="button" aria-label="Меню" aria-expanded="false" aria-controls="menu"><i></i></button>
    </div>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Меню">
  <a class="m-link" href="/new/ru/#uslugi">Процедуры <small>01</small></a>
  <a class="m-link" href="/new/ru/#vizit">Как проходит визит <small>02</small></a>
  <a class="m-link" href="/new/ru/#ceny">Цены <small>03</small></a>
  <a class="m-link" href="/new/ru/#otzyvy">Отзывы <small>04</small></a>
  <a class="m-link" href="/new/ru/#podarok">Подарочная карта <small>05</small></a>
  <a class="m-link" href="/new/ru/#kontakty">Контакты <small>06</small></a>
  <div class="m-foot">
    <a class="btn btn-main" href="/new/ru/zapis/">Записаться онлайн</a>
    <a class="btn btn-ghost" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
  </div>
</nav>`;

const AURORA = '<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>';

function page(s) {
  const name = s.name[L], slug = s.slug[L], tag = TAGLINE[s.id];
  const offers = s.offers;
  const mins = [...new Set(offers.map(o => o.minutes))].sort((a, b) => a - b);
  const minPrice = Math.min(...offers.map(o => o.price));
  const firstBook = offers.find(o => o.book).book;
  const hotIdx = offers.length > 1 ? offers.length - 1 : -1;

  const facts = `
        <div class="facts rv" style="--d:3">
          <span class="fact">${CLOCK}${mins.join(' или ')} мин</span>
          <span class="fact">${TAG}${offers.length > 1 ? 'от ' : ''}${minPrice} €</span>
          <span class="fact">${CAL}Онлайн-запись</span>
        </div>`;

  const goals = s.goals[L].map((g, i) => `
      <div class="gcard rv" style="--d:${i}"><div class="n pearl">${pad(i + 1)}</div><h3>${esc(g)}</h3></div>`).join('');

  const how = s.how[L].map(p => `<p>${esc(p)}</p>`).join('');

  const offerCards = offers.map((o, i) => {
    const hot = i === hotIdx;
    const per = o.sessions ? `<div class="per">${Math.round(o.price / o.sessions * 100) / 100} € за процедуру</div>` : `<div class="per">${esc(ui.minutes(o.minutes))}</div>`;
    const lines = [`${esc(ui.minutes(o.minutes))}${o.sessions ? ` · ${o.sessions} процедур` : ''}`];
    const cta = o.book
      ? `<a class="btn ${hot ? 'btn-light' : 'btn-ghost'}" href="${bookHref(o.book)}">${esc(ui.book(name))}</a>`
      : `<a class="btn ${hot ? 'btn-light' : 'btn-ghost'}" href="${WA}?text=${encodeURIComponent(`Здравствуйте! Хочу узнать про: ${name}, ${o.label[L].toLowerCase()}.`)}" target="_blank" rel="noopener">Уточнить в WhatsApp</a>`;
    return `
      <div class="pcard${hot ? ' hot' : ''} rv" style="--d:${i}">
        <div class="tag">${esc(name)}<span class="pill">${esc(ui.minutes(o.minutes))}</span></div>
        <h3>${esc(o.label[L])}</h3>
        <div class="amt">${o.price}<small> €</small></div>
        ${per}
        ${cta}
      </div>`;
  }).join('');

  const faqItems = [...s.faq[L], ui.faqBook, ui.faqCancel, ui.faqPay, ui.faqWhere].map((f, i) => `
        <div class="acc-i rv${i === 0 ? ' open' : ''}" style="--d:${i}">
          <button class="acc-q" type="button" aria-expanded="${i === 0}"><span>${esc(f.q)}</span><i></i></button>
          <div class="acc-a"><div><p>${esc(f.a)}</p></div></div>
        </div>`).join('');

  const others = SERVICES.filter(o => o.id !== s.id).map((o, i) => {
    const mp = Math.min(...o.offers.map(x => x.price));
    return `
      <a class="ocard rv" style="--d:${i}" href="/new/ru/${o.slug[L]}/">
        <img src="${o.image}" alt="${esc(o.name[L])}" loading="lazy" width="96" height="96">
        <div><h3>${esc(o.name[L])}</h3><small>${TAGLINE[o.id]} · ${o.offers.length > 1 ? 'от ' : ''}${mp} €</small></div>
        <span class="go">${ARROW}</span>
      </a>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#F4ECE2">
<meta name="robots" content="noindex">
<title>${esc(s.h1[L])} (новый дизайн)</title>
<link rel="icon" href="/images/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/new/assets/new.css">
</head>
<body>
${NAV}

<main id="top">

<!-- HERO ПРОЦЕДУРЫ -->
<section class="sec svc-hero">
  <div class="wrap">
    ${AURORA}
    <div>
      <div class="crumbs rv"><a href="/new/ru/">BodyLab</a><span>/</span><a href="/new/ru/#uslugi">Процедуры</a><span>/</span><span>${esc(name)}</span></div>
      <h1 class="h-xl">
        <span class="mask" style="--d:0"><span>${esc(name)}</span></span>
        <span class="mask h-sub" style="--d:1"><span><span class="em">${esc(tag)}</span></span></span>
      </h1>
      <p class="lead rv" style="--d:3;margin-top:22px">${esc(s.lead[L])}</p>${facts}
      <div class="cta-row rv" style="--d:4">
        <a class="btn btn-main" href="${bookHref(firstBook)}">${esc(ui.book(name))} ${ARROW}</a>
        <a class="btn btn-ghost" href="/new/ru/#uslugi">${esc(ui.allTreatments)}</a>
      </div>
    </div>
    <div class="hero-photo rv" style="--d:3">
      <div class="ph"><img id="hero-img" src="${s.image}" alt="${esc(name)}" width="534" height="800" fetchpriority="high"></div>
      <div class="float-chip fc1"><b>${mins[0]}</b><span>минут<small>${offers.length > 1 || mins.length > 1 ? 'одна процедура' : 'длительность'}</small></span></div>
      <div class="float-chip fc2"><b>€</b><span>${offers.length > 1 ? 'от ' : ''}${minPrice} €<small>цена</small></span></div>
    </div>
  </div>
</section>

<!-- КАК ПРОХОДИТ -->
<section class="sec">
  <div class="wrap">
    <div class="how">
      <div class="sec-head" style="margin:0">
        <span class="eyebrow rv">О процедуре</span>
        <h2 class="h-l rv" style="--d:1">${esc(ui.howTitle).replace(/^(\S+)/, '$1')}</h2>
      </div>
      <div class="rv" style="--d:2">${how}</div>
    </div>
  </div>
</section>

<!-- ЗАДАЧИ -->
<section class="sec">
  <div class="wrap" style="background:transparent;box-shadow:none;padding:0">
    <div class="sec-head" style="padding:clamp(20px,3vw,40px) clamp(8px,2vw,24px) 0">
      <span class="eyebrow rv">${esc(ui.goalsTitle)}</span>
    </div>
    <div class="goals">${goals}
    </div>
  </div>
</section>

<!-- ЦЕНЫ -->
<section class="sec" id="ceny">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow rv">${esc(ui.pricesTitle)}</span>
      <h2 class="h-l rv" style="--d:1">Выберите <span class="em">вариант</span></h2>
    </div>
    <div class="offers">${offerCards}
    </div>
    <div class="note rv">${CHECK}<span>${esc(ui.paymentText)} При отмене или переносе менее чем за 24 часа до процедуры оплачивается полная стоимость.</span></div>
  </div>
</section>

<!-- ЧЕГО ОЖИДАТЬ -->
<section class="sec dark">
  <div class="wrap">
    ${AURORA}
    <div class="how">
      <div class="sec-head" style="margin:0">
        <span class="eyebrow rv">Честно о результате</span>
        <h2 class="h-l rv" style="--d:1">${esc(ui.expectTitle)}</h2>
      </div>
      <div class="rv" style="--d:2"><p style="color:#CFC7BD">${esc(ui.expectText)}</p><p style="color:#A39C93;font-size:15px;font-weight:500">${esc(ui.beforeText)}</p></div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="sec">
  <div class="wrap">
    <div class="how">
      <div class="sec-head" style="margin:0">
        <span class="eyebrow rv">FAQ</span>
        <h2 class="h-l rv" style="--d:1">${esc(ui.faqTitle)}</h2>
      </div>
      <div class="acc">${faqItems}
      </div>
    </div>
  </div>
</section>

<!-- ДРУГИЕ ПРОЦЕДУРЫ -->
<section class="sec">
  <div class="wrap" style="background:transparent;box-shadow:none;padding:0">
    <div class="sec-head" style="padding:clamp(20px,3vw,40px) clamp(8px,2vw,24px) 0">
      <span class="eyebrow rv">${esc(ui.otherTitle)}</span>
    </div>
    <div class="ocards">${others}
    </div>
  </div>
</section>

<!-- ФИНАЛЬНЫЙ ПРИЗЫВ -->
<section class="sec dark" data-dock-hide>
  <div class="wrap">
    ${AURORA}
    <div class="cta-card">
      <div>
        <span class="eyebrow rv">Запись</span>
        <h2 class="h-l rv" style="--d:1;margin-top:12px">Готовы <span class="em">начать?</span></h2>
        <p class="lead rv" style="--d:2;margin-top:14px">Выберите свободное время онлайн – это занимает меньше минуты.</p>
      </div>
      <div class="cta-row rv" style="--d:3;margin:0">
        <a class="btn btn-light" href="${bookHref(firstBook)}">${esc(ui.book(name))} ${ARROW}</a>
        <a class="btn btn-ghost" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="f">
  <span>© BodyLab.Beauty · Рига</span>
  <span><a href="/ru/${slug}/">Текущая страница процедуры</a> · <a href="/new/ru/">Новая главная</a> · <a href="/info/">Информация для клиентов</a></span>
</footer>

<div class="dock" id="dock"><a class="btn btn-main" href="${bookHref(firstBook)}">${esc(ui.book(name))} ${ARROW}</a></div>

<script src="/new/assets/new.js" defer></script>
</body>
</html>
`;
}

for (const s of SERVICES) {
  const dir = join(root, 'ru', s.slug[L]);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(s));
  console.log('wrote new/ru/' + s.slug[L] + '/index.html');
}
