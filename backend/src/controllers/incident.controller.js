const prisma = require("../config/prisma");
const { getIO } = require("../config/socket");

const fs = require("fs");

const cloudinary = require("../config/cloudinary");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const { predictIncident } = require("../services/ml.service");

const notificationService = require("../services/notification.service");

// create incident
const createIncident = asyncHandler(async (req, res) => {
  const {  latitude, longitude, description } = req.body;

  
  if (!req.file) {                                   // image validation
    throw new ApiError(400, "Image is required");
  }

  if (latitude == null || longitude == null) {
    throw new ApiError(400, "Image, latitude and longitude are required");
  }

  // upload image to cloudinary database me save hone se phle pehle cloudinary me upload krna hoga
  const result = await cloudinary.uploader.upload(
    req.file.path,
    {
        folder: "public-safety-alert-system",
    }
);

const imageUrl = result.secure_url;

 fs.unlinkSync(req.file.path);

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
    throw new ApiError(404, "Incident not found");
  }

  if (incident.status === status) {
    throw new ApiError(400, `Incident is already ${status.toLowerCase()}`);
  }

  const updatedIncident = await prisma.$transaction(async (tx) => {
    // update status
    const updatedIncident = await tx.incidentReport.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    if (status === "VERIFIED") {
      // fetching the prediction from creatIncident()
      const prediction = await tx.mLPrediction.findUnique({
        where: {
          reportId: incident.id,
        },
      });

      if (!prediction) {
        throw new ApiError(404, "ML prediction not found for this incident");
      }

      // existing alert check
      const existingAlert = await tx.alert.findUnique({
        where: {
          incidentId: incident.id,
        },
      });

      if (!existingAlert) {
        // creating alert on database
        const alert = await tx.alert.create({
          data: {
            title: "Emergency Alert",
            description: incident.description || "Emergency reported",

            severity: prediction.severity,

            latitude: incident.latitude,
            longitude: incident.longitude,

            radius: 5000,

            incidentId: incident.id,

            createdById: req.user.id,
          },
        });

        await notificationService.createNotification(
          {
            userId: incident.reportedById,
            alertId: alert.id,
          },
          tx,
        );
      }
    }

    return updatedIncident;
  });

  // ✅ Emit AFTER transaction completes
  if (status === "VERIFIED") {
    const io = getIO();

    io.emit("new-alert", {
      incidentId: incident.id,
      message: "New emergency alert created.",
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Incident status updated successfully",
        updatedIncident,
      ),
    );
});

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
};
