const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/auth.middleware");
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus
} = require("../controllers/incident.controller");

const router = express.Router();

// create incident
router.post("/", protect, createIncident);

// read indicent
router.get("/", protect, getIncidents);

router.get("/:id", protect, getIncidentById);


// 
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN", "AUTHORITY"),
  updateIncidentStatus,
);

module.exports = router;
