const { Server } = require("socket.io");
const chatSocket = require("./chat.socket.js");
const notificationSocket = require("./notification.socket.js");

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    chatSocket(io, socket);
    notificationSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`⚠️ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocket };
