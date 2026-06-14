const fs = require("fs");
const path = require("path");
const envPath = process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";
const fullEnvPath = path.join(__dirname, envPath);
if (fs.existsSync(fullEnvPath)) {
  require("dotenv").config({ path: fullEnvPath });
} else {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5001;
let dbReady = false;
app.locals.dbReady = false;

// Warn if Mongo URI is missing – useful for dev environments
if (!process.env.MONGO_URI) {
  console.warn('⚠️  MONGO_URI not set – the server will operate in auth‑bypass mode until a DB is configured.');
}

// Use app.locals for DB readiness flag (shared across middleware)
// (already set above)

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(/[,;]/) : [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174',
    'http://localhost:5175', 'http://127.0.0.1:5175',
    'http://localhost:5176', 'http://127.0.0.1:5176'
  ],
  credentials: true,
}));
app.use(express.json());

// Health check — always responds immediately (required by Cloud Run)
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", db: dbReady ? "connected" : "connecting", mode: "db" })
);

app.use("/api", require("./routes/api"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/audits", require("./routes/auditRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/google", require("./routes/googleRoutes"));

// Serve React frontend static files
const frontendDist = path.join(__dirname, "public");
app.use(express.static(frontendDist));
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler – always returns JSON
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Catch-all: serve index.html for client-side routing
app.get('*splat', (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// Start listening FIRST so Cloud Run health checks pass immediately
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// Connect to MongoDB asynchronously (non-blocking)
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  })
  .then(() => {
    dbReady = true;
    app.locals.dbReady = true;
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("⚠️  Server continues running — DB-dependent routes will fail until reconnected.");
    // Do NOT call process.exit — let Cloud Run keep the container alive
    // Mongoose will auto-retry the connection
  });
