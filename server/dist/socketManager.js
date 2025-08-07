import { EVENTS } from "./events.js";
import { Handlers } from "./handlers.js";

export class SocketManager {
  constructor(ui) {
    this.ui = ui;
    this.socket = null;
    this.isConnected = false;
    this.handlers = new Handlers(ui);
  }

  connect(url = "http://localhost:8001") {
    this.socket = io(url);
    this.socket.on("connect", () => {
      this.isConnected = true;
    });
    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });
    this.handlers.register(this.socket);
  }

  // Session methods
  startSession() {
    if (!this.isConnected) {
      this.ui.log("Error", "Not connected to server", "error");
      return;
    }
    this.socket.emit(EVENTS.START_SESSION, {});
    this.ui.log("Action", "Starting new session...");
  }

  endSession(sessionId) {
    if (!sessionId) {
      this.ui.log("Error", "No active session", "error");
      return;
    }
    this.socket.emit(EVENTS.END_SESSION, { session_id: sessionId });
    this.ui.log("Action", `Ending session: ${sessionId}`);
  }

  getProfile(sessionId) {
    if (!sessionId) {
      this.ui.log("Error", "No active session", "error");
      return;
    }
    this.socket.emit(EVENTS.GET_PROFILE, { session_id: sessionId });
    this.ui.log("Action", `Getting profile for session: ${sessionId}`);
  }

  joinSessionUpdates(sessionId) {
    if (!sessionId) {
      this.ui.log("Error", "No active session", "error");
      return;
    }
    this.socket.emit(EVENTS.JOIN_SESSION_UPDATES, { session_id: sessionId });
    this.ui.log("Action", `Joining updates for session: ${sessionId}`);
  }

  leaveSessionUpdates(sessionId) {
    if (!sessionId) {
      this.ui.log("Error", "No active session", "error");
      return;
    }
    this.socket.emit(EVENTS.LEAVE_SESSION_UPDATES, { session_id: sessionId });
    this.ui.log("Action", `Leaving updates for session: ${sessionId}`);
  }

  // Chat methods
  sendMessage(sessionId, message) {
    if (!sessionId) {
      this.ui.log("Error", "No active session", "error");
      return;
    }
    this.socket.emit(EVENTS.SEND_MESSAGE, { session_id: sessionId, message });
    this.ui.addChatMessage("user", message);
    this.ui.log("Chat", `Sent message: ${message}`);
  }

  // Image methods
  uploadImage(sessionId, file) {
    if (!sessionId) {
      this.ui.log("Error", "No active session", "error");
      return;
    }
    if (!file) {
      this.ui.log("Error", "No image file selected", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result.split(",")[1];
      this.socket.emit(EVENTS.UPLOAD_IMAGE, {
        session_id: sessionId,
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

  requestThreatLogs() {
    this.socket.emit(EVENTS.REQUEST_THREAT_LOGS, {});
    this.ui.log("Action", "Requesting threat logs...");
  }
}
