const express = require("express");

const { protect } = require("../middlewares/auth.middleware");

const {
  getAllAlerts,
  getAlertById,
  getNearbyAlerts,
} = require("../controllers/alert.controller");

const router = express.Router();

router.get("/", protect, getAllAlerts);

router.get("/nearby", protect, getNearbyAlerts);

router.get("/:id", protect, getAlertById);

module.exports = router;
