// Rede primeiro, e o que veio fica guardado. Sem rede, entrega o guardado.
// Assim o app abre sem internet e nunca fica preso numa versao velha.
const GUARDADO = 'painel-de-campo';
const BASE = ['./', 'index.html', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png'];
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(GUARDADO).then((c) => c.addAll(BASE))); });
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).then((r) => {
      const copia = r.clone();
      if (r.ok && !e.request.url.includes('versao.json')) caches.open(GUARDADO).then((c) => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
  );
});
