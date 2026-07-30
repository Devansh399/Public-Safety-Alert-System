const express = require("express");

const { protect, authorize } = require("../middlewares/auth.middleware");

const { getDashboardStats } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get(
  "/stats",
  protect,
  authorize("ADMIN", "AUTHORITY"),
  getDashboardStats,
);

module.exports = router;
