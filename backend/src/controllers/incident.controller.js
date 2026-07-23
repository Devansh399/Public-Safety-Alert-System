const prisma = require("../config/prisma");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// create incident
const createIncident = asyncHandler(async (req, res) => {
  const { imageUrl, latitude, longitude, description } = req.body;

  if (!imageUrl || latitude == null || longitude == null) {
    throw new ApiError(400, "Image, latitude and longitude are required");
  }

  const incident = await prisma.incidentReport.create({
    data: {
      imageUrl,
      latitude,
      longitude,
      description,
      reportedById: req.user.id,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Incident reported successfully", incident));
});

// read,geticident
const getIncidents = asyncHandler(async (req, res) => {

  //pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  // finding from database
const incidents = await prisma.incidentReport.findMany({
    skip,
    take: limit,
    orderBy: {
        createdAt: "desc"
    }
});

  const totalIncidents = await prisma.incidentReport.count();

  return res.status(200).json(
    new ApiResponse(
        200,
        "Incidents fetched successfully",
        {
            incidents,
            pagination: {
                total: totalIncidents,
                page,
                limit,
                totalPages: Math.ceil(totalIncidents / limit)
            }
        }
    )
);

});

module.exports = {
  createIncident,
  getIncidents,
};
