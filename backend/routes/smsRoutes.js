const express = require("express");
const router = express.Router();
const smsController = require("../controllers/smsController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.post("/subscribe", authMiddleware, smsController.subscribe);
router.delete("/unsubscribe", authMiddleware, smsController.unsubscribe);
router.post("/send-alerts", authMiddleware, requireRole("admin"), smsController.triggerAlerts);

module.exports = router;
