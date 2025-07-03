const { Server } = require("socket.io");
const Redis = require("ioredis");
const chatSocket = require("./chat.socket.js");
const notificationSocket = require("./notification.socket.js");

const pub = new Redis({
  host: process.env.VALKEY_HOST,
  port: process.env.VALKEY_PORT,
  username: process.env.VALKEY_USERNAME,
  password: process.env.VALKEY_PASSWORD,
});

const sub = new Redis({
  host: process.env.VALKEY_HOST,
  port: process.env.VALKEY_PORT,
  username: process.env.VALKEY_USERNAME,
  password: process.env.VALKEY_PASSWORD,
});

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Subscribe to both chat and notification channels
  sub.subscribe("CHAT_MESSAGES");
  sub.subscribe("NOTIFICATION_MESSAGES");

  sub.on("message", (channel, message) => {
    if (channel === "CHAT_MESSAGES") {
      io.emit("chat:receive", JSON.parse(message));
    } else if (channel === "NOTIFICATION_MESSAGES") {
      io.emit("notification:receive", JSON.parse(message));
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    chatSocket(io, socket, pub);
    notificationSocket(io, socket, pub);

    socket.on("disconnect", () => {
      console.log(`⚠️ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocket };
