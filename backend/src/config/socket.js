const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        console.log(`Client Connected : ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Client Disconnected : ${socket.id}`);
        });

    });

};

const getIO = () => {

    if (!io) {
        throw new Error("Socket.IO is not initialized.");
    }

    return io;

};

module.exports = {
    initializeSocket,
    getIO
};