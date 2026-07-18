/* Service worker do Planejador Disney 2027.
   Estratégia stale-while-revalidate: responde do cache na hora (funciona
   offline no parque) e atualiza o cache em segundo plano a cada visita.
   A versão do cache é carimbada automaticamente com o SHA do commit pelo
   workflow bump-sw-cache.yml a cada merge em main. */
var CACHE = 'disney2027-eed4652';
var ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './baloo2-latin.woff2'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(e.request).then(function (cached) {
        var fresh = fetch(e.request).then(function (resp) {
          if (resp && resp.ok) c.put(e.request, resp.clone());
          return resp;
        }).catch(function () { return cached; });
        return cached || fresh;
      });
    })
  );
});
