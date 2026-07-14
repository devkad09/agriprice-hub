const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const { query } = require("./config/db");

const app = express();
const requestedPort = Number(process.env.PORT || 5000);

const clientOrigin = process.env.CLIENT_URL || "http://localhost:8080";
const corsOptions = {
  origin: process.env.NODE_ENV !== "production" ? true : clientOrigin,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Register API routes
const authRoutes = require("./routes/authRoutes");
const priceRoutes = require("./routes/priceRoutes");
const marketRoutes = require("./routes/marketRoutes");
const commodityRoutes = require("./routes/commodityRoutes");
const smsRoutes = require("./routes/smsRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/markets", marketRoutes);
app.use("/api/commodities", commodityRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AgriFarm API is running",
  });
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "AgriFarm Node/Express Backend running successfully.",
    environment: process.env.NODE_ENV || "development",
  });
});

const startServer = (port) => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`[AgriBackend] Express server running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(`[AgriBackend] Port ${port} is busy; trying ${port + 1}`);
      startServer(port + 1);
      return;
    }

    console.error("[AgriBackend] Failed to start server:", error);
    process.exit(1);
  });
};

if (require.main === module) {
  startServer(requestedPort);
}

module.exports = app;
// Trigger Vercel deploy after Root Directory update

