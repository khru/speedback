const CACHE_NAME = 'speedback-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use addAll for critical assets. If one fails, install fails.
      return cache.addAll(ASSETS).catch(err => console.warn('Non-critical asset cache failed:', err));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  // Ignore chrome-extension schemes etc
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Check if valid response
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Determine if we should cache this response
          const url = new URL(event.request.url);
          
          // We want to cache:
          // 1. Basic requests (our own files)
          // 2. External assets explicitly used (Tailwind, Google Fonts, Gstatic font files)
          const isExternalAsset = 
            url.hostname.includes('tailwindcss.com') ||
            url.hostname.includes('googleapis.com') ||
            url.hostname.includes('gstatic.com'); // Critical for woff2 font files

          // Cache 'basic' (same origin) or 'cors' (external CDNs)
          if (networkResponse.type === 'basic' || (networkResponse.type === 'cors' && isExternalAsset)) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }

          return networkResponse;
        })
        .catch(() => {
          // Network failure fallback
        });

      return cached || fetchPromise;
    })
  );
});