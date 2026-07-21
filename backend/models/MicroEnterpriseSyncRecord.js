const mongoose = require("mongoose");

const microEnterpriseSyncRecordSchema = new mongoose.Schema(
  {
    clientRecordId: { type: String, required: true, unique: true, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    sourceUpdatedAt: { type: Date, required: true },
    serverUpdatedAt: { type: Date, default: Date.now, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports =
  mongoose.models.MicroEnterpriseSyncRecord ||
  mongoose.model("MicroEnterpriseSyncRecord", microEnterpriseSyncRecordSchema);
