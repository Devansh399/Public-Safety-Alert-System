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

module.exports = {
    getAllAlerts,
    getAlertById
};