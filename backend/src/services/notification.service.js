const prisma = require("../config/prisma");

const createNotification = async ({ userId, alertId }, db = prisma) => {
  return db.notification.create({
    data: {
      userId,
      alertId,
    },
  });
};

const getUserNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    include: {
      alert: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


//marked read notification
const markNotificationAsRead = async (
    notificationId,
    userId,
    db = prisma
) => {

    return db.notification.updateMany({

        where: {
            id: notificationId,
            userId
        },

        data: {
            status: "READ",
            readAt: new Date()
        }

    });

};


// count unread notification
const getUnreadNotificationCount = async (
    userId,
    db = prisma
) => {

    const count = await db.notification.count({
        where: {
            userId,
            status: "SENT"
        }
    });

    return count;

};


//marked all notification read

const markAllNotificationsAsRead = async (
    userId,
    db = prisma
) => {

    return db.notification.updateMany({
        where: {
            userId,
            status: "SENT"
        },
        data: {
            status: "READ",
            readAt: new Date()
        }
    });

};



module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    getUnreadNotificationCount,
    markAllNotificationsAsRead
};