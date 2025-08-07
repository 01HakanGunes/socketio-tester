import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

// TODO Initialize a queue for messages and a response string value

// Add 2 restapi endpoints one to get the queue data and other to send a string as message.
// Maybe "getMessages", and "sendMessage"

// Serve static files from dist folder
app.use(express.static("./dist"));

// Socketio server code

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("chat_message", (message) => {
    console.log("Received message:", message);
    // Store messages in a queue
  });
  // Rest endpoints should be here i guess because the socketio connection established here
  // send this emit when sendMessage request arrives to http endpoint somehow.
  // Here add socket.emit("chat_response", agent_message);
});

httpServer.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
