const express = require("express");
const router = express.Router();
const commodityController = require("../controllers/commodityController");

router.get("/", commodityController.getAllCommodities);
router.get("/:id", commodityController.getCommodityById);

module.exports = router;
