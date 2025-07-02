module.exports = (io, socket) => {
  socket.on("notification:send", (data) => {
    console.log("Received notification:", data);
    io.emit("notification:receive", data); // Broadcast to all
  });
};
