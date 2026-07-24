const prisma = require("../config/prisma");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const { predictIncident } = require("../services/ml.service");

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

  // ml service
  const prediction = await predictIncident({
    imageUrl: incident.imageUrl,
    latitude: incident.latitude,
    longitude: incident.longitude,
    description: incident.description,
  });

  // saving prediction in database
  await prisma.mLPrediction.create({
    data: {
      detectedClass: prediction.detectedClass,
      confidence: prediction.confidence,
      severity: prediction.severity,
      reportId: incident.id,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, "Incident reported successfully", {
      incident,
      prediction,
    }),
  );
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
    },
  });

  if (!incident) {
    throw new ApiError(404, "Incident not found");
  }

  if (req.user.role === "CITIZEN" && incident.reportedById !== req.user.id) {
    throw new ApiError(403, "You are not authorized to access this incident");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Incident fetched successfully", incident));
});

//authenticating and updating the incident status
const updateIncidentStatus = asyncHandler(async (req, res) => {
  // extract data
  const { id } = req.params;
  const { status } = req.body;

  //validate status ki user correct status send kr rha hai ya nhi
  const allowedStatus = ["PENDING", "VERIFIED", "REJECTED"];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid incident status");
  }

  // find incident
  const incident = await prisma.incidentReport.findUnique({
    where: {
      id,
    },
  });

  if (!incident) {
    throw new ApiError(
        404,
        "Incident not found"
    );
}

if (incident.status === status) {
  throw new ApiError(
    400,
    `Incident is already ${status.toLowerCase()}`
  );
}

// update status
const updatedIncident = await prisma.incidentReport.update({
    where: {
        id
    },
    data: {
        status
    }
});


if (status === "VERIFIED") {

  
  // fetching the prediction from creatIncident()
  const prediction = await prisma.mLPrediction.findUnique({
    where: {
      reportId: incident.id
    }
  });

  if (!prediction) {
  throw new ApiError(
    404,
    "ML prediction not found for this incident"
  );
}
  
  
  
  const existingAlert = await prisma.alert.findUnique({
    where: {
      incidentId: incident.id
    }
  });
  
  if (!existingAlert) {
    
    // creating alert on database
    await prisma.alert.create({
      data: {
        title: "Emergency Alert",
        description: incident.description || "Emergency reported",
        
        severity: prediction.severity,
        
        latitude: incident.latitude,
        longitude: incident.longitude,
        
        radius: 5000,
        
        incidentId: incident.id,
        
        createdById: req.user.id
      }
    });
  }

}




return res.status(200).json(
    new ApiResponse(
        200,
        "Incident status updated successfully",
        updatedIncident
    )
);


});

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
};
