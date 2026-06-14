require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:5174', 'http://127.0.0.1:5174',
    'http://localhost:5175', 'http://127.0.0.1:5175',
    'http://localhost:5176', 'http://127.0.0.1:5176'
  ],
  credentials: true,
}));
app.use(express.json());

app.use("/api", require("./routes/api"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/audits", require("./routes/auditRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/google", require("./routes/googleRoutes"));

app.get("/api/health", (req, res) => res.json({ status: "ok", mode: "db" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    console.error("👉 Run: net start MongoDB   (as Administrator)");
    process.exit(1);
  });
