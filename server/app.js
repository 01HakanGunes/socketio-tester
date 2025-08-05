import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

// Serve static files from dist folder
app.use(express.static("./dist"));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.emit("message", "Hello I am server.");

  socket.on("message", (message) => {
    console.log("Received message:", message);
    io.emit("message", message + "is a good message bro.");
  });
});

httpServer.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
