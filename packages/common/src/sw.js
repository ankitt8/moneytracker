import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
precacheAndRoute(self.__WB_MANIFEST);

// This assumes /index.html has been precached. which is done by preacheAndRoute
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

self.addEventListener('message', (e) => {
  console.log('message', e);
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// GOING WITH WORKBOX SINCE BELOW CODE WAS GIVING SOME UNEXPECTED ERRORS
// // const urlsToCache = ['/', 'rupee.png'];
// const urlsToCache = self.__precacheManifest;
// console.log('test');
// const staticAssetsCacheName = 'static-assets-v1';
// console.log('test');
// self.addEventListener('install', (e) => {
//   console.log('install');
//   e.waitUntil(
//     caches.open(staticAssetsCacheName).then((cache) => {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });
// self.addEventListener('activate', (e) => {
//   // delete all other caches starting with static-assets
//   e.waitUntil(
//     caches.keys().then((cacheKeys) => {
//       const cachesToDelete = cacheKeys.filter(
//         (key) =>
//           key.startsWith('static-assets') && key !== staticAssetsCacheName
//       );
//       return Promise.all(
//         cachesToDelete.map((cacheKey) => caches.delete(cacheKey))
//       );
//     })
//   );
//   console.log('activate');
// });

// self.addEventListener('fetch', (e) => {
//   // stale while revalidate approach
//   e.respondWith(
//     caches.match(e.request).then((cachedResponse) => {
//       // console.log(cachedResponse ? cachedResponse : 'Its not in the cache');
//       if (e.request.destination === 'image') {
//         return cachedResponse;
//       }
//       if (e.request.url.includes('api')) {
//         return fetch(e.request);
//       }
//       // if(!event)
//       const networkFetch = fetch(e.request).then((res) => {
//         caches.open(staticAssetsCacheName).then((cache) => {
//           cache.put(e.request, res.clone());
//         });
//       });
//       console.log({ cachedResponse, networkFetch });
//       return cachedResponse || networkFetch;
//     })
//   );
// });
