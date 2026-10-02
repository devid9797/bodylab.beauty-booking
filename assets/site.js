/*
 * BodyLab.Beauty - logic shared by every page (home pages and service pages):
 * traffic-source attribution, Google tag + cookie consent, the language switch,
 * and the local test mode. Loaded as a classic script so the functions below are
 * globals the home page's booking code can call.
 */

// Google Analytics 4 (BodyLab.Beauty property). Cookies are set only after the
// visitor accepts the banner (Consent Mode v2). Add an 'AW-...' ID here too if
// Google Ads tracking is ever needed.
const GOOGLE_TAG_IDS = ['G-6S1QVMTQFZ'];

// Meta (Instagram/Facebook) Pixel. Loaded only once the visitor accepts the cookie
// banner - Meta has no cookieless mode, so nothing is sent before that. Reports
// PageView on every page and Schedule when a booking is confirmed.
const META_PIXEL_ID = '1396153806065123';

// Google Ads booking conversion, e.g. 'AW-XXXXXXXXXX/AbCdEfGhIjK'. Optional - the
// URL change to BOOKING_CONFIRMED_PATH below already lets Ads count bookings by URL.
const ADS_BOOKING_CONVERSION = '';
// Shown in the address bar after a successful booking so Google Ads can count it
// as a conversion ("page URL contains pieraksts-apstiprinats"). A real page exists
// at this path that sends a reload back to the home page.
const BOOKING_CONFIRMED_PATH = '/pieraksts-apstiprinats';

// Local preview (localhost / *.localhost / *.test): bookings are
// simulated instead of being sent to Make.com, so testing can never
// create a real booking, touch the studio calendar or message anyone. Reading the
// public slot list stays real (read-only).
const BB_TEST_MODE = /^(localhost|127\.0\.0\.1|\[::1\])$|\.localhost$|\.test$/.test(location.hostname);

const PAGE_LANG = (document.documentElement.lang || 'lv').slice(0, 2);
const LANG_KEY = 'bb_lang';

// ---------- Traffic source attribution ----------
// Works out where a visitor came from (UTM tags, ad click IDs, referrer, in-app
// browser) and sends it along with the booking, so every booking record says
// "instagram", "chatgpt", "google" etc. First touch is kept for 90 days; last
// touch is the most recent non-direct visit.
const ATTR_FIRST_KEY = 'bb_attr_first_v1';
const ATTR_LAST_KEY  = 'bb_attr_last_v1';
const ATTR_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const REFERRER_SOURCES = [
  [/(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com)$/, 'chatgpt'],
  [/(^|\.)perplexity\.ai$/, 'perplexity'],
  [/^gemini\.google\.com$/, 'gemini'],
  [/(^|\.)copilot\.microsoft\.com$/, 'copilot'],
  [/(^|\.)claude\.ai$/, 'claude'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)(facebook\.com|fb\.com|messenger\.com)$/, 'facebook'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)google\.[a-z.]+$/, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)(yandex\.[a-z.]+|ya\.ru)$/, 'yandex'],
  [/(^|\.)(ss\.lv|ss\.com)$/, 'ss.lv'],
];

// The "/" -> "/ru/" language redirect replaces the referrer with our own URL, so
// it hands the original referrer over through sessionStorage.
function originalReferrer(){
  let ref = document.referrer;
  try{
    const handedOver = sessionStorage.getItem('bb_orig_referrer');
    if(handedOver !== null){
      sessionStorage.removeItem('bb_orig_referrer');
      ref = handedOver;
    }
  }catch(e){}
  return ref;
}

function detectVisitSource(){
  const p = new URLSearchParams(window.location.search);
  const ua = navigator.userAgent || '';
  let refHost = '';
  try{ const ref = originalReferrer(); refHost = ref ? new URL(ref).hostname.replace(/^www\./, '') : ''; }catch(e){}
  if(refHost && refHost === window.location.hostname.replace(/^www\./, '')) refHost = '';

  const touch = {
    source: '', medium: p.get('utm_medium') || '', campaign: p.get('utm_campaign') || '',
    content: p.get('utm_content') || '', referrer: refHost,
    landing: window.location.pathname + window.location.search, ts: Date.now()
  };
  const utmSource = (p.get('utm_source') || '').trim().toLowerCase();
  if(utmSource){
    touch.source = utmSource.replace(/^chatgpt\.com$/, 'chatgpt');
  } else if(p.get('gclid') || p.get('gbraid') || p.get('wbraid')){
    touch.source = 'google'; touch.medium = touch.medium || 'cpc';
  } else if(p.get('fbclid')){
    touch.source = /Instagram/i.test(ua) || /instagram/.test(refHost) ? 'instagram' : 'facebook';
    touch.medium = touch.medium || 'social';
  } else if(p.get('ttclid')){
    touch.source = 'tiktok'; touch.medium = touch.medium || 'cpc';
  } else if(refHost){
    const match = REFERRER_SOURCES.find(([re]) => re.test(refHost));
    touch.source = match ? match[1] : refHost;
    touch.medium = touch.medium || (match && ['google','bing','yandex'].includes(match[1]) ? 'organic' : 'referral');
  } else if(/Instagram/i.test(ua)){
    // Instagram's in-app browser often strips the referrer (e.g. bio links).
    touch.source = 'instagram'; touch.medium = 'social';
  } else if(/FBAN|FBAV/i.test(ua)){
    touch.source = 'facebook'; touch.medium = 'social';
  }
  return touch;
}

function readAttr(key){
  try{
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v && Date.now() - v.ts < ATTR_TTL_MS ? v : null;
  }catch(e){ return null; }
}

(function recordVisitSource(){
  const touch = detectVisitSource();
  if(!touch.source) return; // direct visit - keep whatever we already know
  try{
    if(!readAttr(ATTR_FIRST_KEY)) localStorage.setItem(ATTR_FIRST_KEY, JSON.stringify(touch));
    localStorage.setItem(ATTR_LAST_KEY, JSON.stringify(touch));
  }catch(e){ /* storage unavailable, ignore */ }
})();

function bookingAttribution(){
  const last = readAttr(ATTR_LAST_KEY) || {};
  const first = readAttr(ATTR_FIRST_KEY) || {};
  return {
    source: last.source || 'direct',
    source_medium: last.medium || '',
    source_campaign: last.campaign || '',
    source_content: last.content || '',
    source_referrer: last.referrer || '',
    source_landing: last.landing || '',
    first_source: first.source || last.source || 'direct',
  };
}

// ---------- Google tag + cookie consent (Consent Mode v2) ----------
// Everything defaults to "denied"; the tag only sets cookies after the visitor
// accepts. The choice is remembered, so the banner shows once per browser.
const CONSENT_KEY = 'bb_consent_v1';
const CONSENT_TEXT = {
  lv: { text: 'Mēs izmantojam sīkdatnes, lai saprastu, kā apmeklētāji atrod mūsu vietni, un uzlabotu reklāmas.', accept: 'Piekrītu', decline: 'Atteikt' },
  en: { text: 'We use cookies to understand how visitors find our site and to improve our ads.', accept: 'Accept', decline: 'Decline' },
  ru: { text: 'Мы используем cookie, чтобы понимать, как посетители находят наш сайт, и улучшать рекламу.', accept: 'Принять', decline: 'Отклонить' },
};
window.dataLayer = window.dataLayer || [];
function gtag(){ window.dataLayer.push(arguments); }

function applyConsent(granted){
  const v = granted ? 'granted' : 'denied';
  gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
  if(granted) loadMetaPixel();
}

// Meta's standard base code, run only after consent (see applyConsent).
function loadMetaPixel(){
  if(!META_PIXEL_ID || BB_TEST_MODE || window.fbq) return;
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

function showConsentBanner(){
  const txt = CONSENT_TEXT[PAGE_LANG] || CONSENT_TEXT.lv;
  const banner = document.createElement('div');
  banner.className = 'consent-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  const msg = document.createElement('div');
  msg.textContent = txt.text;
  const actions = document.createElement('div');
  actions.className = 'consent-actions';
  const decline = document.createElement('button');
  decline.type = 'button'; decline.className = 'btn btn-outline'; decline.textContent = txt.decline;
  const accept = document.createElement('button');
  accept.type = 'button'; accept.className = 'btn btn-primary'; accept.textContent = txt.accept;
  actions.append(decline, accept);
  banner.append(msg, actions);
  document.body.appendChild(banner);

  const choose = granted => {
    applyConsent(granted);
    try{ localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied'); }catch(e){}
    banner.remove();
  };
  accept.addEventListener('click', () => choose(true));
  decline.addEventListener('click', () => choose(false));
}

(function initTracking(){
  if((!GOOGLE_TAG_IDS.length && !META_PIXEL_ID) || BB_TEST_MODE) return; // keep test traffic out of real analytics
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });
  let saved = null;
  try{ saved = localStorage.getItem(CONSENT_KEY); }catch(e){}
  if(saved) applyConsent(saved === 'granted');

  if(GOOGLE_TAG_IDS.length){
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_TAG_IDS[0])}`;
    document.head.appendChild(s);
    gtag('js', new Date());
    GOOGLE_TAG_IDS.forEach(id => gtag('config', id));
  }

  if(!saved) showConsentBanner();
})();

function trackBookingConversion(service){
  if(BB_TEST_MODE) return;
  if(GOOGLE_TAG_IDS.length){
    gtag('event', 'generate_lead', { service, traffic_source: bookingAttribution().source });
    if(ADS_BOOKING_CONVERSION) gtag('event', 'conversion', { send_to: ADS_BOOKING_CONVERSION });
  }
  // Only defined when the visitor accepted cookies.
  if(window.fbq) fbq('track', 'Schedule', { content_name: service });
}

// Swaps the address bar to BOOKING_CONFIRMED_PATH while the confirmation is open
// and puts the original URL back when it closes. replaceState keeps the Back
// button behaving as before; the page itself never reloads.
let urlBeforeBooking = null;
function setBookingConfirmedUrl(on){
  try{
    if(on){
      if(urlBeforeBooking === null) urlBeforeBooking = location.pathname + location.search + location.hash;
      history.replaceState(history.state, '', BOOKING_CONFIRMED_PATH);
    } else if(urlBeforeBooking !== null){
      history.replaceState(history.state, '', urlBeforeBooking);
      urlBeforeBooking = null;
    }
  }catch(e){ /* e.g. file:// previews disallow path changes - not critical */ }
}

// ---------- Language switch ----------
// The options are plain links to the same page in another language; the page's
// language comes from its URL. Clicking one also remembers the choice, which only
// decides where a later visit to "/" lands.
(function initLangSwitch(){
  const langSwitch = document.getElementById('lang-switch');
  const langToggle = document.getElementById('lang-toggle');
  if(!langSwitch || !langToggle) return;

  function closeLangMenu(){
    langSwitch.classList.remove('open');
    langToggle.setAttribute('aria-expanded', 'false');
  }
  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !langSwitch.classList.contains('open');
    langSwitch.classList.toggle('open', willOpen);
    langToggle.setAttribute('aria-expanded', String(willOpen));
  });
  langSwitch.querySelectorAll('.lang-option[data-lang]').forEach(a => {
    a.addEventListener('click', () => {
      try{ localStorage.setItem(LANG_KEY, a.dataset.lang); }catch(e){}
      // Carry tracking/booking parameters (utm_* etc.) over to the other language.
      if(location.search && a.getAttribute('href').indexOf('?') === -1){
        a.setAttribute('href', a.getAttribute('href') + location.search);
      }
    });
  });
  document.addEventListener('click', (e) => {
    if(!langSwitch.contains(e.target)) closeLangMenu();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeLangMenu();
  });
})();
