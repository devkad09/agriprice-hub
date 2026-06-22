const express = require("express");
const router = express.Router();
const priceController = require("../controllers/priceController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", priceController.getAllPrices);
router.get("/trends", priceController.getPriceTrends);
router.get("/compare", priceController.compareMarkets);

router.post("/", authMiddleware, requireRole("data_officer", "admin"), priceController.addPrice);
router.put(
  "/:id",
  authMiddleware,
  requireRole("data_officer", "admin"),
  priceController.updatePrice,
);
router.delete("/:id", authMiddleware, requireRole("admin"), priceController.deletePrice);

module.exports = router;
