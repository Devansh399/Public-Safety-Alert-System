const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const { createIncident, getIncidents } = require("../controllers/incident.controller");

const router = express.Router();

// create incident
router.post("/", protect, createIncident);

// read indicent
router.get("/", protect, getIncidents);

module.exports = router;
