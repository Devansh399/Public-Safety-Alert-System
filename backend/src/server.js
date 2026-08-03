require("dotenv").config();

const http = require("http");
const app = require("./app");

const { initializeSocket } = require("./config/socket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});