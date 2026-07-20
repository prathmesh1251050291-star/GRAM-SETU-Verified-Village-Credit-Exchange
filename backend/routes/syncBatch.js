const express = require("express");

function timestampValue(dateValue) {
  const timestamp = new Date(dateValue).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

function createBatchSyncHandler(Model) {
  if (!Model) {
    throw new Error("A Mongoose model is required for batch sync.");
  }

  return async function batchSyncHandler(req, res, next) {
    try {
      const records = Array.isArray(req.body?.records) ? req.body.records : null;
      if (!records) {
        res.status(400).json({ error: "records must be an array." });
        return;
      }

      const results = [];
      for (const record of records) {
        const clientRecordId = record?.clientRecordId;
        const incomingTimestamp = timestampValue(record?.updatedAt);

        if (!clientRecordId || incomingTimestamp === null) {
          results.push({
            clientRecordId: clientRecordId || null,
            status: "rejected",
            reason: "clientRecordId and valid updatedAt are required.",
          });
          continue;
        }

        const existing = await Model.findOne({ clientRecordId });
        if (!existing) {
          await Model.create({
            clientRecordId,
            payload: record.data,
            sourceUpdatedAt: new Date(incomingTimestamp),
            serverUpdatedAt: new Date(),
          });
          results.push({ clientRecordId, status: "upserted" });
          continue;
        }

        const currentTimestamp = timestampValue(existing.sourceUpdatedAt || existing.serverUpdatedAt);
        if (currentTimestamp === null || incomingTimestamp > currentTimestamp) {
          existing.payload = record.data;
          existing.sourceUpdatedAt = new Date(incomingTimestamp);
          existing.serverUpdatedAt = new Date();
          await existing.save();
          results.push({ clientRecordId, status: "updated" });
          continue;
        }

        results.push({
          clientRecordId,
          status: "conflict_server_wins",
          serverUpdatedAt: existing.serverUpdatedAt,
        });
      }

      const accepted = results.filter((entry) =>
        ["upserted", "updated", "accepted"].includes(entry.status)
      ).length;
      res.status(200).json({ total: records.length, accepted, conflicts: records.length - accepted, results });
    } catch (error) {
      next(error);
    }
  };
}

function createSyncRouter({ Model }) {
  const router = express.Router();
  router.post("/api/sync/micro-enterprises", createBatchSyncHandler(Model));
  return router;
}

module.exports = {
  createBatchSyncHandler,
  createSyncRouter,
};
