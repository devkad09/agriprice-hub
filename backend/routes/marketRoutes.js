const express = require("express");
const router = express.Router();
const marketController = require("../controllers/marketController");

router.get("/", marketController.getAllMarkets);
router.get("/:id", marketController.getMarketById);

module.exports = router;
