import { EVENTS } from "./events.js";

export class Handlers {
  constructor(ui) {
    this.ui = ui;
  }

  register(socket) {
    // Connection events
    socket.on(EVENTS.CONNECT, () => {
      this.ui.updateConnectionStatus(true);
      this.ui.log("Connection", "Connected to Security Gate System", "success");
    });

    socket.on(EVENTS.DISCONNECT, () => {
      this.ui.updateConnectionStatus(false);
      this.ui.log("Connection", "Disconnected from server", "error");
    });

    socket.on(EVENTS.HEALTH_STATUS, (data) => {
      this.ui.log("Health Check", JSON.stringify(data, null, 2), "success");
    });

    socket.on(EVENTS.THREAT_LOGS, (data) => {
      this.ui.log(
        "Threat Logs",
        `Received ${Array.isArray(data) ? data.length : 0} log entries`,
        "success",
      );
      this.ui.displayThreatLogs(data);
    });

    socket.on(EVENTS.ERROR, (data) => {
      this.ui.log("Error", JSON.stringify(data, null, 2), "error");
    });

    // Chat events
    socket.on(EVENTS.CHAT_RESPONSE, (data) => {
      this.ui.log("Chat Response", JSON.stringify(data, null, 2), "success");
      if (data.agent_response) {
        this.ui.addChatMessage("agent", data.agent_response);
      }
      if (data.session_complete) {
        this.ui.addChatMessage("system", "Session completed!");
      }
    });

    // Image events
    socket.on(EVENTS.IMAGE_UPLOAD_RESPONSE, (data) => {
      this.ui.log(
        "Image Upload",
        JSON.stringify(data, null, 2),
        data.status === "success" ? "success" : "error",
      );
      this.ui.updateUploadStatus(data.message, data.status);
      if (data.status === "success") {
        this.ui.clearImageInput();
      }
    });
  }
}
