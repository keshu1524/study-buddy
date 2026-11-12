// Study Buddy SW — केवल सफाई संस्कृति: कोई cache नहीं, कोई offline नहीं
// (user ने PWA नहीं चाहा) — यह SW activate होते ही खुद को unregister कर देता है
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map(k => caches.delete(k)))
    await self.registration.unregister()
  })())
})

self.addEventListener('fetch', () => {}) // patli व्यवहार — सब जाने दो, network ही
