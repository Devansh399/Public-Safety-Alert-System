const prisma = require("../config/prisma");

const getDashboardStats = async (db = prisma) => {

    const [
        totalIncidents,
        pendingIncidents,
        verifiedIncidents,
        rejectedIncidents,
        totalAlerts,
        highSeverityAlerts,
        mediumSeverityAlerts,
        lowSeverityAlerts
    ] = await Promise.all([

        db.incidentReport.count(),

        db.incidentReport.count({
            where: {
                status: "PENDING"
            }
        }),

        db.incidentReport.count({
            where: {
                status: "VERIFIED"
            }
        }),

        db.incidentReport.count({
            where: {
                status: "REJECTED"
            }
        }),

        db.alert.count({
            where: {
                deletedAt: null
            }
        }),

        db.alert.count({
            where: {
                severity: "HIGH",
                deletedAt: null
            }
        }),

        db.alert.count({
            where: {
                severity: "MEDIUM",
                deletedAt: null
            }
        }),

        db.alert.count({
            where: {
                severity: "LOW",
                deletedAt: null
            }
        })

    ]);

    return {
        totalIncidents,
        pendingIncidents,
        verifiedIncidents,
        rejectedIncidents,
        totalAlerts,
        highSeverityAlerts,
        mediumSeverityAlerts,
        lowSeverityAlerts
    };

};

module.exports = {
    getDashboardStats
};