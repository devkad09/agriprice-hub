const path = require("path");
// Load environment variables from parent directory .env file
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const priceRoutes = require("./routes/priceRoutes");
const marketRoutes = require("./routes/marketRoutes");
const commodityRoutes = require("./routes/commodityRoutes");
const smsRoutes = require("./routes/smsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all requests, allowing client on 8080 to fetch
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/markets", marketRoutes);
app.use("/api/commodities", commodityRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/admin", adminRoutes);

// Base health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "AgriFarm Node/Express Backend running successfully.",
    environment: process.env.NODE_ENV || "development",
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[AgriBackend] Express server running on port ${PORT}`);
});
