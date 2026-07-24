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

// read /  geticident
const getIncidents = asyncHandler(async (req, res) => {
  //pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  let whereClause = {};

  if (req.user.role === "CITIZEN") {
    whereClause.reportedById = req.user.id;
  }

  // finding from database
  const incidents = await prisma.incidentReport.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalIncidents = await prisma.incidentReport.count({
    where: whereClause,
  });

  return res.status(200).json(
    new ApiResponse(200, "Incidents fetched successfully", {
      incidents,
      pagination: {
        total: totalIncidents,
        page,
        limit,
        totalPages: Math.ceil(totalIncidents / limit),
      },
    }),
  );
});

// find by id
const getIncidentById = asyncHandler(async (req, res) => {
  const { id } = req.params; // extracting  id

  const incident = await prisma.incidentReport.findUnique({
    where: {
      id,
    }
    
  });

  if (!incident) {
    throw new ApiError(
        404,
        "Incident not found"
    );
}

if (
    req.user.role === "CITIZEN" &&
    incident.reportedById !== req.user.id
) {
    throw new ApiError(
        403,
        "You are not authorized to access this incident"
    );
}

return res.status(200).json(
    new ApiResponse(
        200,
        "Incident fetched successfully",
        incident
    )
);

});

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
};
