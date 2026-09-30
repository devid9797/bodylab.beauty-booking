/**
 * BodyLab.Beauty — edge cache in front of the Apps Script slots endpoint.
 *
 * Why: the Apps Script Web App takes 2-6 s per request even when its own cache
 * is warm, and Google caps it at ~30 concurrent executions. With many visitors
 * at once requests queue up or fail, and the booking calendar "hangs".
 *
 * This Worker answers every visitor from Cloudflare's edge cache in ~50 ms and
 * talks to Apps Script at most about once every FRESH_SECONDS, in the background
 * (stale-while-revalidate). If Apps Script is slow or down, visitors still get
 * the last good slot list for up to STALE_SECONDS; a slot that got booked in the
 * meantime is still rejected at submit time by the Make.com "taken" check.
 *
 * Deploy: Cloudflare dashboard → Workers & Pages → Create → Worker → paste this
 * file → Deploy. Put the resulting https://<name>.<account>.workers.dev URL into
 * SLOTS_PROXY_URL in index.html.
 */

const ORIGIN_URL =
  'https://script.google.com/macros/s/AKfycbyUN_pLo0v-laLE7NDLfAZ8bKmyEQt2-jZNyfAX4Wc3fd2PVzq5JxfT8SkUORIcdFiR/exec';

const FRESH_SECONDS = 15;   // serve from cache without refreshing
const STALE_SECONDS = 900;  // keep serving the last good copy while refreshing / if origin fails
const ORIGIN_TIMEOUT_MS = 20000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// One origin fetch per isolate at a time, however many visitors arrive together.
let inflight = null;

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    const cache = caches.default;
    // Fixed key: query strings (cache-busters etc.) must not fragment the cache.
    const cacheKey = new Request(new URL('/__slots', request.url).toString());

    const cached = await cache.match(cacheKey);
    if (cached) {
      const age = (Date.now() - Number(cached.headers.get('X-Fetched-At') || 0)) / 1000;
      if (age > FRESH_SECONDS) {
        ctx.waitUntil(refresh(cache, cacheKey).catch(() => {}));
      }
      return toClient(await cached.text(), age);
    }

    try {
      const body = await refresh(cache, cacheKey);
      return toClient(body, 0);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'slots unavailable' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }
  },
};

function refresh(cache, cacheKey) {
  if (!inflight) {
    inflight = fetchOrigin(cache, cacheKey).finally(() => { inflight = null; });
  }
  return inflight;
}

async function fetchOrigin(cache, cacheKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ORIGIN_TIMEOUT_MS);
  let body;
  try {
    const res = await fetch(ORIGIN_URL, { redirect: 'follow', signal: controller.signal });
    if (!res.ok) throw new Error('origin status ' + res.status);
    body = await res.text();
  } finally {
    clearTimeout(timeoutId);
  }

  // Apps Script answers quota/runtime errors with HTTP 200 and an HTML page or an
  // {error} object - never let that replace a good cached slot list.
  const parsed = JSON.parse(body);
  if (!Array.isArray(parsed)) throw new Error('origin returned non-array');

  await cache.put(cacheKey, new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=' + STALE_SECONDS,
      'X-Fetched-At': String(Date.now()),
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
