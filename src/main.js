import "../app.js";
import "./wallet.js";

if ("serviceWorker" in navigator) {
  void navigator.serviceWorker.getRegistrations().then((registrations) =>
    Promise.all(registrations.map((registration) => registration.unregister())),
  );
}

if ("caches" in window) {
  void window.caches.keys().then((keys) =>
    Promise.all(
      keys
        .filter((key) => key.startsWith("danat-swap-demo-"))
        .map((key) => window.caches.delete(key)),
    ),
  );
}
