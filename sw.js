// One-time cleanup for the old cache-first static demo worker.
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("danat-swap-demo-"))
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister()),
  );
});
