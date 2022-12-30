const CACHE_NAME = "NAGP";
const to_cache_assets = [
  "/",
  "/index.html",
  "/bundle.js",
  "/img/icon-72x72.png",
  "/css/style.css",
  "/img/logo.svg",
  "/img/icon-144x144.png"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(to_cache_assets);
    })
    .then(self.skipWaiting())
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
      .then(() => self.clients.claim())
  )
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    fetch(fetchEvent.request)
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return await cache.match(fetchEvent.request);
      })
  );
});
