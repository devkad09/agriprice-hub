const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/users", authMiddleware, requireRole("admin"), adminController.getAllUsers);
router.get("/audit-log", authMiddleware, requireRole("admin"), adminController.getAuditLog);
router.get("/stats", authMiddleware, adminController.getStats);
router.post(
  "/bulk-import",
  authMiddleware,
  requireRole("admin"),
  upload.single("file"),
  adminController.bulkImportPrices,
);
router.post("/update-role", authMiddleware, requireRole("admin"), adminController.updateUserRole);

module.exports = router;
