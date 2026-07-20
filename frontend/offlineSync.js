const DB_NAME = "gram_setu_offline_db";
const STORE_NAME = "financial_inputs";
const DB_VERSION = 1;
const DEFAULT_SYNC_TAG = "gram-setu-financial-sync";

function buildLocalId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function openIndexedDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "_localId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveRecords(records) {
  const db = await openIndexedDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    records.forEach((record) => store.put(record));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function readRecords() {
  const db = await openIndexedDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function removeRecords(localIds) {
  if (!localIds.length) {
    return;
  }

  const db = await openIndexedDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    localIds.forEach((id) => store.delete(id));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function sendBatch(records, backendUrl, fetchImpl) {
  const response = await fetchImpl(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records }),
  });

  if (!response.ok) {
    throw new Error(`Batch sync failed with status ${response.status}`);
  }

  return response.json().catch(() => ({ results: [] }));
}

async function registerBackgroundSync(syncTag = DEFAULT_SYNC_TAG) {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  if (registration.sync && typeof registration.sync.register === "function") {
    await registration.sync.register(syncTag);
  }
}

export async function cacheFinancialInput(inputData) {
  const now = new Date().toISOString();
  const record = {
    _localId: inputData?._localId || buildLocalId(),
    _updatedAt: inputData?._updatedAt || now,
    _syncedAt: null,
    payload: inputData,
  };
  await saveRecords([record]);
  return record;
}

export async function syncCachedFinancialInputs({
  backendUrl = "/api/sync/micro-enterprises",
  fetchImpl = fetch,
} = {}) {
  const queuedRecords = await readRecords();
  if (!queuedRecords.length) {
    return { synced: 0, remaining: 0 };
  }

  const payloadRecords = queuedRecords.map((record) => ({
    clientRecordId: record._localId,
    updatedAt: record._updatedAt,
    data: record.payload,
  }));

  const result = await sendBatch(payloadRecords, backendUrl, fetchImpl);
  const acceptedIds = (result.results || [])
    .filter((entry) =>
      ["upserted", "updated", "accepted"].includes(String(entry.status || "").toLowerCase())
    )
    .map((entry) => entry.clientRecordId);

  if (!acceptedIds.length && !result.results?.length) {
    await removeRecords(queuedRecords.map((item) => item._localId));
    return { synced: queuedRecords.length, remaining: 0 };
  }

  await removeRecords(acceptedIds);
  return { synced: acceptedIds.length, remaining: queuedRecords.length - acceptedIds.length };
}

export async function submitFinancialInput(inputData, options = {}) {
  const { backendUrl = "/api/sync/micro-enterprises", fetchImpl = fetch, syncTag = DEFAULT_SYNC_TAG } =
    options;
  const online = typeof navigator === "undefined" ? true : navigator.onLine;

  const queuedRecord = {
    _localId: inputData?._localId || buildLocalId(),
    _updatedAt: new Date().toISOString(),
    payload: inputData,
  };

  if (!online) {
    await saveRecords([queuedRecord]);
    await registerBackgroundSync(syncTag).catch(() => undefined);
    return { mode: "cached", localId: queuedRecord._localId };
  }

  try {
    await sendBatch(
      [
        {
          clientRecordId: queuedRecord._localId,
          updatedAt: queuedRecord._updatedAt,
          data: queuedRecord.payload,
        },
      ],
      backendUrl,
      fetchImpl
    );
    return { mode: "synced", localId: queuedRecord._localId };
  } catch (error) {
    await saveRecords([queuedRecord]);
    await registerBackgroundSync(syncTag).catch(() => undefined);
    return { mode: "cached_fallback", localId: queuedRecord._localId, error: error.message };
  }
}

export async function registerFinancialSyncServiceWorker({
  serviceWorkerPath = "/frontend/service-worker.js",
  syncTag = DEFAULT_SYNC_TAG,
  backendUrl = "/api/sync/micro-enterprises",
  fetchImpl = fetch,
} = {}) {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  const registration = await navigator.serviceWorker.register(serviceWorkerPath);
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "GRAM_SETU_TRIGGER_FINANCIAL_SYNC") {
      syncCachedFinancialInputs({ backendUrl, fetchImpl }).catch(() => undefined);
    }
  });

  if (registration.sync && typeof registration.sync.register === "function") {
    await registration.sync.register(syncTag).catch(() => undefined);
  }
  return registration;
}

export function setupOnlineSyncListener(options = {}) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onOnline = () => {
    syncCachedFinancialInputs(options).catch(() => undefined);
  };

  window.addEventListener("online", onOnline);
  return () => window.removeEventListener("online", onOnline);
}
