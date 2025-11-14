self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('grow-tracker-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icon-1024x1024.png',
        '/icon-512x512.png'
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})