const mongoose = require("mongoose");

const forbiddenRawDataKeys = [
  "name",
  "phone",
  "email",
  "address",
  "aadhaar",
  "pan",
  "upi",
  "account",
  "ifsc",
  "transaction",
];

const liquidityRatiosSchema = new mongoose.Schema(
  {
    currentRatio: { type: Number, min: 0, required: true },
    quickRatio: { type: Number, min: 0, required: true },
    debtServiceCoverageRatio: { type: Number, min: 0, required: true },
  },
  { _id: false }
);

const shockExposureSchema = new mongoose.Schema(
  {
    weather: { type: Number, min: 0, max: 100, required: true },
    market: { type: Number, min: 0, max: 100, required: true },
    supplyChain: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false }
);

const creditAssessmentSchema = new mongoose.Schema(
  {
    enterpriseClusterHash: { type: String, required: true, index: true },
    reportingCycle: { type: String, required: true },
    aggregatedMetrics: {
      liquidityRatios: { type: liquidityRatiosSchema, required: true },
      groupScore: { type: Number, min: 0, max: 100, required: true },
      shockExposurePercentages: { type: shockExposureSchema, required: true },
    },
    simulationOutputs: {
      riskProbabilityIndex: { type: Number, min: 0, max: 1, required: true },
      confidenceScore: { type: Number, min: 0, max: 1, required: true },
    },
    assessedAt: { type: Date, default: Date.now },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

function findForbiddenKey(source) {
  if (!source || typeof source !== "object") {
    return null;
  }

  const entries = Array.isArray(source) ? source.entries() : Object.entries(source);
  for (const [key, value] of entries) {
    const keyText = String(key).toLowerCase();
    if (forbiddenRawDataKeys.some((forbidden) => keyText.includes(forbidden))) {
      return keyText;
    }
    const nested = findForbiddenKey(value);
    if (nested) {
      return nested;
    }
  }
  return null;
}

creditAssessmentSchema.pre("validate", function validateAggregateOnly(next) {
  const forbiddenKey = findForbiddenKey(this.toObject({ minimize: false }));
  if (forbiddenKey) {
    next(new Error(`Raw or personally identifiable fields are not allowed (${forbiddenKey}).`));
    return;
  }
  next();
});

module.exports = mongoose.models.CreditAssessment || mongoose.model("CreditAssessment", creditAssessmentSchema);
