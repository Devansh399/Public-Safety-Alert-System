const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {

};

const getIO = () => {
    return io;
};

module.exports = {
    initializeSocket,
    getIO
};