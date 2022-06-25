const urlsToCache = ['/', 'rupee.png'];
console.log('test');
const staticAssetsCacheName = 'static-assets-v10';
console.log('test');
self.addEventListener('install', (e) => {
  console.log('install');
  e.waitUntil(
    caches.open(staticAssetsCacheName).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener('activate', (e) => {
  // delete all other caches starting with static-assets
  e.waitUntil(
    caches.keys().then((cacheKeys) => {
      const cachesToDelete = cacheKeys.filter(
        (key) =>
          key.startsWith('static-assets') && key !== staticAssetsCacheName
      );
      return Promise.all(
        cachesToDelete.map((cacheKey) => caches.delete(cacheKey))
      );
    })
  );
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
          if (res.status === 404) {
            return new Response('opps');
          }
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

self.addEventListener('message', (e) => {
  console.log('message', e);
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
