import { EVENTS } from "./events.js";
import { Handlers } from "./handlers.js";

export class SocketManager {
  constructor(ui) {
    this.ui = ui;
    this.socket = null;
    this.isConnected = false;
    this.handlers = new Handlers(ui, this);
    this.cameraStream = null;
    this.cameraInitialized = false;
  }

  connect(url = "http://localhost:3000") {
    this.socket = io(url);
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.initializeCamera();
    });
    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });
    this.handlers.register(this.socket);
  }

  // Chat methods
  sendMessage(message) {
    this.socket.emit(EVENTS.SEND_MESSAGE, { message });
    this.ui.addChatMessage("user", message);
    this.ui.log("Chat", `Sent message: ${message}`);
  }

  // Image methods
  uploadImage(file) {
    if (!file) {
      this.ui.log("Error", "No image file selected", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result.split(",")[1];
      this.socket.emit(EVENTS.UPLOAD_IMAGE, {
        image: base64Data,
        timestamp: new Date().toISOString(),
      });
      this.ui.updateUploadStatus("Uploading image...", "");
      this.ui.log("Action", `Uploading image: ${file.name}`);
    };
    reader.readAsDataURL(file);
  }

  // System methods
  requestHealthCheck() {
    this.socket.emit(EVENTS.REQUEST_HEALTH_CHECK, {});
    this.ui.log("Action", "Requesting health check...");
  }

  requestLogs() {
    this.socket.emit(EVENTS.REQUEST_LOGS, {});
    this.ui.log("Action", "Requesting logs...");
  }

  // Camera methods
  async initializeCamera() {
    try {
      this.ui.updateCameraStatus("Requesting camera permission...", "");
      this.ui.log("Camera", "Requesting camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      this.cameraStream = stream;
      this.ui.getCameraVideo().srcObject = stream;
      this.cameraInitialized = true;

      this.ui.updateCameraStatus("Camera ready", "success");
      this.ui.log("Camera", "Camera initialized successfully", "success");
    } catch (error) {
      this.ui.updateCameraStatus("Camera access denied", "error");
      this.ui.log(
        "Camera",
        `Camera initialization failed: ${error.message}`,
        "error",
      );
    }
  }

  async captureFrame() {
    if (!this.cameraInitialized || !this.cameraStream) {
      this.ui.log("Camera", "Camera not initialized", "error");
      return null;
    }

    try {
      const video = this.ui.getCameraVideo();
      const canvas = this.ui.getCameraCanvas();
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const base64Data = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
      this.ui.log("Camera", "Frame captured successfully", "success");

      return base64Data;
    } catch (error) {
      this.ui.log("Camera", `Frame capture failed: ${error.message}`, "error");
      return null;
    }
  }

  async sendFrameResponse() {
    const frameData = await this.captureFrame();
    if (frameData) {
      this.socket.emit(EVENTS.FRAME_RESPONSE, {
        image: frameData,
        timestamp: new Date().toISOString(),
      });
      this.ui.log("Camera", "Frame sent via FRAME_RESPONSE", "success");
    }
  }
}
