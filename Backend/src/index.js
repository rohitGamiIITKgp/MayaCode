const http = require("http");
const app = require("./app.js");
const { setupSocket } = require("./sockets/index.js");
require("dotenv").config()
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

setupSocket(server); // Attach socket logic

server.listen(PORT, () =>
  console.log(`Server running on PORT:${PORT}`)
);
