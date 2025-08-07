import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

// Initialize a queue for messages and a response string value
let messageQueue = [];
let responseString = "";

// Add middleware for JSON parsing
app.use(express.json());

// Serve static files from dist folder
app.use(express.static("./dist"));

// REST API endpoints
app.get("/api/getMessages", (_req, res) => {
  res.json({
    messages: messageQueue,
    responseString: responseString,
  });
});

app.post("/api/sendMessage", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  responseString = message;

  // Emit to all connected clients
  io.emit("chat_response", message);

  res.json({
    success: true,
    message: "Message sent successfully",
    sentMessage: message,
  });
});

// Socket.IO server code
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("chat_message", (message) => {
    console.log("Received message:", message);

    // Store messages in a queue
    messageQueue.push({
      id: Date.now(),
      message: message,
      timestamp: new Date().toISOString(),
      socketId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
