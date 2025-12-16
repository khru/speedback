const CACHE_NAME = 'speedback-v6-offline';

// Core assets to pre-cache immediately
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.tailwindcss.com',
  // Critical Libraries (matching index.html)
  'https://esm.sh/react@18.3.1',
  'https://esm.sh/react-dom@18.3.1',
  'https://esm.sh/uuid@^9.0.1',
  'https://esm.sh/lucide-react@^0.294.0',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use addAll. If any fails, the SW install fails (good for ensuring integrity)
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.error('SW Pre-cache failed:', err);
      });
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
  // Only handle GET
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Identify external critical assets (CDNs)
  const isExternalAsset = 
    url.hostname === 'esm.sh' ||
    url.hostname === 'cdn.tailwindcss.com' ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  // Strategy: Cache First, Network Fallback
  // This is crucial for offline apps relying on CDNs
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Check for valid response
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Don't cache chrome-extension:// or other weird schemes
          if (!url.protocol.startsWith('http')) {
            return networkResponse;
          }

          // Cache logic
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // For external assets, we cache them aggressively
            if (isExternalAsset || url.origin === self.location.origin) {
               cache.put(event.request, clone);
            }
          });

          return networkResponse;
        })
        .catch(() => {
          // Offline fallback could go here (e.g., serve index.html for navigation)
          // For now, if it fails and not in cache, it just fails.
        });
    })
  );
});