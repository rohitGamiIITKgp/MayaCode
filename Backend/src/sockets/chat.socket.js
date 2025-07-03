module.exports = (io, socket, pub) => {
  socket.on("chat:send", (data) => {
    console.log("Received chat:", data);
    pub.publish("CHAT_MESSAGES", JSON.stringify(data));
  });
};
