const urlsToCache = ['/', 'rupee.png'];
const staticAssetsCacheName = 'static-assets';
self.addEventListener('install', (e) => {
  console.log('install');
  e.waitUntil(
    caches.open(staticAssetsCacheName).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener('activate', () => {
  console.log('activate');
});

self.addEventListener('fetch', (e) => {
  // stale while revalidate approach
  e.respondWith(
    caches.open(staticAssetsCacheName).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        // console.log(cachedResponse ? cachedResponse : 'Its not in the cache');
        if (e.request.destination === 'image') {
          return cachedResponse;
        }
        if (e.request.destination.includes('api')) {
          return fetch(e.request);
        }
        // if(!event)
        const networkFetch = fetch(e.request).then((res) => {
          caches.open(staticAssetsCacheName).then((cache) => {
            cache.put(e.request, res.clone());
          });
        });
        // console.log({ cachedResponse, networkFetch });
        return cachedResponse || networkFetch;
      });
    })
  );
});
