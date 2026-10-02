/**
 * BodyLab.Beauty — edge cache in front of the Apps Script slots endpoint.
 *
 * Why: the Apps Script Web App takes 2-6 s per request even when its own cache
 * is warm (and sometimes 30 s+ on a cold start), and Google caps it at ~30
 * concurrent executions. With many visitors at once requests queue up or fail,
 * and the booking calendar "hangs".
 *
 * This Worker answers visitors from Cloudflare's cache in ~50 ms and refreshes
 * from Apps Script in the background (stale-while-revalidate). If Apps Script is
 * slow or down, visitors keep getting the last good slot list for up to
 * STALE_SECONDS; a slot booked in the meantime is still rejected at submit time
 * by the Make.com "taken" check.
 *
 * Rules learned the hard way:
 *  - Never let one request await a promise/fetch started by another request.
 *    The Workers runtime can leave such a promise pending forever, which hung
 *    the proxy for every visitor. Only plain data is shared between requests.
 *  - Never make a visitor wait on Apps Script when any earlier copy exists.
 *
 * Deploy: Cloudflare dashboard → Workers & Pages → bodylab-slots → Edit code →
 * paste this file → Deploy. Recommended: Settings → Triggers → Cron Triggers →
 * add "*\/5 * * * *" so the cache is refreshed every 5 minutes even when nobody
 * is on the site (the scheduled() handler below).
 */

const ORIGIN_URL =
  'https://script.google.com/macros/s/AKfycbyUN_pLo0v-laLE7NDLfAZ8bKmyEQt2-jZNyfAX4Wc3fd2PVzq5JxfT8SkUORIcdFiR/exec';
// Fixed cache key, so the cron refresh and visitor requests share one entry.
const CACHE_KEY = 'https://bodylab-slots.bodylab-beauty-riga.workers.dev/__slots';

const FRESH_SECONDS = 15;          // younger than this: serve, no refresh
const STALE_SECONDS = 6 * 3600;    // keep serving the last good copy this long
const REFRESH_LEASE_MS = 30000;    // one background refresh at a time
const BLOCKING_TIMEOUT_MS = 20000; // visitor waits at most this when nothing is cached
const BACKGROUND_TIMEOUT_MS = 45000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Plain data only (see rules above): last good copy + refresh lease per isolate.
let memo = null;        // { body, fetchedAt }
let leaseUntil = 0;

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    const copy = await readCopy();
    if (copy) {
      const ageMs = Date.now() - copy.fetchedAt;
      if (ageMs > FRESH_SECONDS * 1000 && Date.now() > leaseUntil) {
        leaseUntil = Date.now() + REFRESH_LEASE_MS;
        ctx.waitUntil(refresh(BACKGROUND_TIMEOUT_MS).catch(() => {}));
      }
      return toClient(copy.body, ageMs / 1000);
    }

    // Nothing cached anywhere. If another visitor is already fetching, poll the
    // cache for its result instead of piling more load onto Apps Script (polling
    // reads plain data - it never awaits the other request's promise).
    try {
      if (Date.now() < leaseUntil) {
        const deadline = Date.now() + BLOCKING_TIMEOUT_MS;
        while (Date.now() < deadline) {
          await new Promise(r => setTimeout(r, 300));
          const c = await readCopy();
          if (c) return toClient(c.body, (Date.now() - c.fetchedAt) / 1000);
          if (Date.now() >= leaseUntil) break; // that fetch failed: try ourselves
        }
      }
      leaseUntil = Date.now() + BLOCKING_TIMEOUT_MS;
      const body = await refresh(BLOCKING_TIMEOUT_MS);
      leaseUntil = 0;
      return toClient(body, 0);
    } catch (err) {
      leaseUntil = 0;
      return new Response(JSON.stringify({ error: 'slots unavailable' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }
  },

  // Cron Trigger: keeps the cache warm so visitors never hit a cold Apps Script.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(refresh(BACKGROUND_TIMEOUT_MS).catch(() => {}));
  },
};

async function readCopy() {
  let best = memo;
  try {
    const cached = await caches.default.match(CACHE_KEY);
    if (cached) {
      const fetchedAt = Number(cached.headers.get('X-Fetched-At') || 0);
      if (!best || fetchedAt > best.fetchedAt) best = { body: await cached.text(), fetchedAt };
    }
  } catch (e) { /* cache unavailable: fall back to memo */ }
  if (best && Date.now() - best.fetchedAt > STALE_SECONDS * 1000) return null;
  return best;
}

async function refresh(timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let body;
  try {
    const res = await fetch(ORIGIN_URL, { redirect: 'follow', signal: controller.signal });
    if (!res.ok) throw new Error('origin status ' + res.status);
    body = await res.text();
  } finally {
    clearTimeout(timeoutId);
  }

  // Apps Script answers quota/runtime errors with HTTP 200 and an HTML page or an
  // {error} object - never let that replace a good slot list.
  const parsed = JSON.parse(body);
  if (!Array.isArray(parsed)) throw new Error('origin returned non-array');

  const fetchedAt = Date.now();
  memo = { body, fetchedAt };
  await caches.default.put(CACHE_KEY, new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=' + STALE_SECONDS,
      'X-Fetched-At': String(fetchedAt),
    },
  }));
  return body;
}

function toClient(body, ageSeconds) {
  return new Response(body, {
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Slots-Age': String(Math.round(ageSeconds)),
    },
  });
}
