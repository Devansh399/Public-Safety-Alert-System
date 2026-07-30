const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const dashboardService = require("../services/dashboard.service");

const getDashboardStats = asyncHandler(async (req, res) => {

    const stats = await dashboardService.getDashboardStats();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Dashboard statistics fetched successfully.",
            stats
        )
    );

});

module.exports = {
    getDashboardStats
};