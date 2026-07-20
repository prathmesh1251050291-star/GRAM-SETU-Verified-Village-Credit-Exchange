const express = require("express");
const mongoose = require("mongoose");
const { createSyncRouter } = require("./routes/syncBatch");
const MicroEnterpriseSyncRecord = require("./models/MicroEnterpriseSyncRecord");

const app = express();
const port = Number(process.env.PORT || 10000);
const mongoUri = process.env.MONGODB_URI;

app.use(express.json({ limit: "1mb" }));
app.use(createSyncRouter({ Model: MicroEnterpriseSyncRecord }));

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use((error, _req, res, _next) => {
  const statusCode = error?.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? "Internal server error." : error.message,
  });
});

async function connectToDatabase() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is required.");
  }
  await mongoose.connect(mongoUri);
}

async function startServer() {
  await connectToDatabase();
  const server = app.listen(port, () => {
    console.log(`GRAM-SETU API listening on port ${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await mongoose.connection.close().catch(() => undefined);
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

