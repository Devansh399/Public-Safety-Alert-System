const express = require("express");

const {
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
} = require("../controllers/notification.controller");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/unread-count", protect, getUnreadNotificationCount);

router.get("/", protect, getNotifications);

router.patch("/read-all", protect, markAllNotificationsAsRead);

router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;
