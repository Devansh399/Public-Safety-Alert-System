const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const {
  createIncident,
  getIncidents,
  getIncidentById
} = require("../controllers/incident.controller");

const router = express.Router();

// create incident
router.post("/", protect, createIncident);

// read indicent
router.get("/", protect, getIncidents);

router.get("/:id", protect, getIncidentById);

module.exports = router;
