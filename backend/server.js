const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { query } = require("./config/db");

const app = express();
const requestedPort = Number(process.env.PORT || 5000);

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

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

startServer(requestedPort);
