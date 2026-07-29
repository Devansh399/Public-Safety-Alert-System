const express = require("express");

const { protect } = require("../middlewares/auth.middleware");

const { getAllAlerts, getAlertById } = require("../controllers/alert.controller");

const router = express.Router();

router.get("/", protect, getAllAlerts);

router.get("/:id", protect, getAlertById);

module.exports = router;
