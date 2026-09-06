const CACHE_PREFIX = 'externalize-shell-';
const CACHE = `${CACHE_PREFIX}v2`;
const CORE_SHELL = [
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

async function precacheBuiltShell() {
  const cache = await caches.open(CACHE);
  const response = await fetch('/index.html', { cache: 'reload' });
  if (!response.ok) {
    throw new Error(`Unable to precache app shell: ${response.status}`);
  }

  const html = await response.clone().text();
  const discovered = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((path) => path.startsWith('/') && !path.startsWith('//'));
  const assets = [...new Set([...CORE_SHELL, ...discovered])];

  await cache.addAll(assets);
  await cache.put('/index.html', response.clone());
  await cache.put('/', response);
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheBuiltShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      await Promise.all([
        cache.put('/index.html', response.clone()),
        cache.put('/', response.clone()),
      ]);
    }
    return response;
  } catch {
    return (await caches.match('/index.html')) ?? (await caches.match('/')) ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreVary: true });
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    event.request.mode === 'navigate'
      ? networkFirstNavigation(event.request)
      : cacheFirst(event.request),
  );
});
