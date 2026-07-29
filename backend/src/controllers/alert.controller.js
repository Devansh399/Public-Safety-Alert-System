const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const alertService = require("../services/alert.service");

const getAllAlerts = asyncHandler(async (req, res) => {

    const alerts = await alertService.getAllAlerts();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Alerts fetched successfully",
            alerts
        )
    );

});

// get specific alert by id 
const getAlertById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const alert = await alertService.getAlertById(id);

    if (!alert) {
        throw new ApiError(
            404,
            "Alert not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Alert fetched successfully",
            alert
        )
    );

});

// near by alerts
const getNearbyAlerts = asyncHandler(async (req, res) => {

    const { lat, lng } = req.query;

    if (!lat || !lng) {
        throw new ApiError(
            400,
            "Latitude and Longitude are required."
        );
    }

    const alerts = await alertService.getNearbyAlerts(
        Number(lat),
        Number(lng)
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Nearby alerts fetched successfully.",
            alerts
        )
    );

});

module.exports = {
    getAllAlerts,
    getAlertById,
    getNearbyAlerts
};