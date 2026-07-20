# GRAM-SETU-Verified-Village-Credit-Exchange
GRAM-SETU is an offline-first AI platform bridging rural MSMEs and formal bank credit via transparent scoring, climate-shock simulation, and group-level aggregation aligned with NABARD institutional rails.

## Build-phase implementation modules

- Frontend offline-first IndexedDB + Service Worker sync utility: `frontend/offlineSync.js`, `frontend/service-worker.js`
- Frontend Web Speech API React hook: `frontend/useRiskSpeech.js`
- Backend aggregate-only Mongoose schema: `backend/models/CreditAssessment.js`
- Backend offline batch sync endpoint with timestamp conflict resolution: `backend/routes/syncBatch.js`
- High-performance Monte-Carlo simulation (C++): `cplusplus/monte_carlo_risk.cpp`
