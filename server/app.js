import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

// Initialize a queue for messages and a response string value
let messageQueue = [];
let responseString = "";

// Initialize frame queue with limit of 10
let frameQueue = [];
const FRAME_QUEUE_LIMIT = 10;

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

app.get("/api/getLatestMessage", (_req, res) => {
  if (messageQueue.length === 0) {
    return res.status(404).json({ error: "No messages available" });
  }

  // Pop the latest message (last item in array - LIFO behavior)
  const latestMessage = messageQueue.pop();

  res.json({
    success: true,
    message: latestMessage,
    remainingCount: messageQueue.length,
  });
});

app.post("/api/sendMessage", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  responseString = message;

  // Emit to all connected clients
  io.emit("chat_response", { agent_response: message });

  res.json({
    success: true,
    message: "Message sent successfully",
    sentMessage: message,
  });
});

// Get latest frame endpoint
app.get("/api/getLatestFrame", (_req, res) => {
  if (frameQueue.length === 0) {
    return res.status(404).json({ error: "No frames available" });
  }

  // Pop the latest frame (last item in array - LIFO behavior)
  const latestFrame = frameQueue.pop();

  res.json({
    success: true,
    frame: latestFrame,
    remainingCount: frameQueue.length,
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

  // Handle frame responses from client
  socket.on("frame_response", (data) => {
    console.log("Received frame response:", {
      timestamp: data.timestamp,
      imageSize: data.image ? data.image.length : 0,
    });

    // Store frame in queue
    frameQueue.push({
      id: Date.now(),
      image: data.image,
      timestamp: data.timestamp,
      socketId: socket.id,
    });

    // Keep queue size under limit
    if (frameQueue.length > FRAME_QUEUE_LIMIT) {
      frameQueue.shift(); // Remove oldest frame
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start automatic frame capture timer
setInterval(() => {
  if (frameQueue.length < FRAME_QUEUE_LIMIT) {
    io.emit("frame_request", {
      requestId: Date.now(),
      timestamp: new Date().toISOString(),
    });
  }
}, 1000);

httpServer.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
  console.log("Automatic frame capture started (1 frame/second)");
});
