self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

async function notifyClientsToSync() {
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  clients.forEach((client) => {
    client.postMessage({ type: "GRAM_SETU_TRIGGER_FINANCIAL_SYNC" });
  });
}

self.addEventListener("sync", (event) => {
  if (event.tag === "gram-setu-financial-sync") {
    event.waitUntil(notifyClientsToSync());
  }
});
