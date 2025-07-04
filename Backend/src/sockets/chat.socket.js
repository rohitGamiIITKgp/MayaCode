module.exports = (io, socket, pub) => {
  socket.on("chat:send", (data) => {
    console.log("Received chat:", data);
    pub.publish("CHAT_MESSAGES", JSON.stringify(data));
    console.log("Emitting message:delivered", data);
    socket.emit("message:delivered", {
      message: data.message,
      timestamp: new Date().toISOString(),
    });
  });
};
