const express = require("express");

const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const incidentRoutes = require("./incident.routes");
const notificationRoutes = require("./notification.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

router.use("/incidents", incidentRoutes);

router.use("/notifications", notificationRoutes);

module.exports = router;