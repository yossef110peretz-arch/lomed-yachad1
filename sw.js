const CACHE_NAME = 'lomed-yachad-v1';
const ASSETS = [
  '/lomed-yachad1/',
  '/lomed-yachad1/index.html',
  '/lomed-yachad1/לומדים-יחד.html',
  'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700;900&family=Noto+Serif+Hebrew:wght@300;400;600;700&display=swap'
];

// התקנה — שמור קבצים בקאש
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// הפעלה — מחק קאש ישן
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// בקשות — תחילה מהרשת, אם נכשל — מהקאש
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
