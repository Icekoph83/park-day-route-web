// Keeps the planner usable with a weak signal: the page itself comes from the network when it can, else from the copy saved here.
const C = 'pdr-6d0d6ae6d6';
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.origin !== location.origin) return;   // wait times and fonts go straight to the network
  // no-cache: always ask GitHub whether the page changed (a quick check), so a phone never keeps showing an older copy.
  e.respondWith(fetch(e.request, {cache:'no-cache'}).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
