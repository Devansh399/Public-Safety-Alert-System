const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const notificationService = require("../services/notification.service");


// read notification
const getNotifications = asyncHandler(async (req, res) => {

    const notifications =
        await notificationService.getUserNotifications(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Notifications fetched successfully",
            notifications
        )
    );

});


// marks read
const markNotificationAsRead = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const result = await notificationService.markNotificationAsRead(
        id,
        req.user.id
    );

    if (result.count === 0) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Notification marked as read"
        )
    );

});


// count unread notifications
const getUnreadNotificationCount = asyncHandler(async (req, res) => {

    const count = await notificationService.getUnreadNotificationCount(
        req.user.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            { count },
            "Unread notification count fetched successfully"
        )
    );

});


// marked all notifications read
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {

    const result = await notificationService.markAllNotificationsAsRead(
        req.user.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                updatedCount: result.count
            },
            `${result.count} notification(s) marked as read`
        )
    );

});

module.exports = {
    getNotifications,
    markNotificationAsRead,
    getUnreadNotificationCount,
    markAllNotificationsAsRead
};