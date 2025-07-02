module.exports = (io, socket) => {
  socket.on("chat:send", (data) => {
    console.log("Received chat:", data);
    io.emit("chat:receive", data); // Broadcast to all
  });
};
