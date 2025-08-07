import { EVENTS } from "./events.js";
import { Handlers } from "./handlers.js";

export class SocketManager {
  constructor(ui) {
    this.ui = ui;
    this.socket = null;
    this.isConnected = false;
    this.handlers = new Handlers(ui);
  }

  connect(url = "http://localhost:3000") {
    this.socket = io(url);
    this.socket.on("connect", () => {
      this.isConnected = true;
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
}
