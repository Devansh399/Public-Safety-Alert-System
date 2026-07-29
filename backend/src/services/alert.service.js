const calculateDistance = require("../utils/calculateDistance");



const prisma = require("../config/prisma");

const getAllAlerts = async (db = prisma) => {
    return db.alert.findMany({
        where: {
            deletedAt: null
        },

        include: {
            incident: true,
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            }
        },

        orderBy: {
            createdAt: "desc"
        }
    });
};


// get detais of specific alert
const getAlertById = async (alertId, db = prisma) => {
    return db.alert.findUnique({
        where: {
            id: alertId,
            deletedAt: null
        },
        include: {
            incident: true,
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            }
        }
    });
};


// get nearby alerts
const getNearbyAlerts = async (
    latitude,
    longitude,
    db = prisma
) => {

    const alerts = await db.alert.findMany({
        where: {
            deletedAt: null
        },
        include: {
            incident: true,
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            }
        }
    });

   const nearbyAlerts = alerts
    .map((alert) => {
        const distance = calculateDistance(
            latitude,
            longitude,
            alert.latitude,
            alert.longitude
        );

        return {
            ...alert,
            distance: Number(distance.toFixed(2))
        };
    })
    .filter((alert) => alert.distance <= alert.radius);

return nearbyAlerts;
};

module.exports = {
    getAllAlerts,
    getAlertById,
    getNearbyAlerts
};