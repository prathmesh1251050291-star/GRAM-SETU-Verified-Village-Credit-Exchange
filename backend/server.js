const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const { createSyncRouter } = require("./routes/syncBatch");
const MicroEnterpriseSyncRecord = require("./models/MicroEnterpriseSyncRecord");

const app = express();
const PORT = Number(process.env.PORT) || 10000;
const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose.set("bufferCommands", false);

app.use(express.json({ limit: "1mb" }));

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
} else {
  console.warn("MONGODB_URI is not set. Sync endpoints will be unavailable.");
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    mongodbConnected: mongoose.connection.readyState === 1,
  });
});

app.use("/api/sync", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ error: "Database connection unavailable." });
    return;
  }
  next();
});

app.use(createSyncRouter({ Model: MicroEnterpriseSyncRecord }));

const frontendPath = path.join(__dirname, "..", "frontend");
app.use("/frontend", express.static(frontendPath));

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "GRAM-SETU backend",
    health: "/health",
    syncEndpoint: "/api/sync/micro-enterprises",
  });
});

app.use((err, _req, res, _next) => {
  const message = err instanceof Error ? err.message : "Unexpected server error";
  res.status(500).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`GRAM-SETU backend listening on port ${PORT}`);
});
