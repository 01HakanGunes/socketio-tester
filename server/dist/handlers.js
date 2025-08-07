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
      this.ui.resetSession();
    });

    // System events
    socket.on(EVENTS.STATUS, (data) => {
      this.ui.log("Status", JSON.stringify(data, null, 2));
    });

    socket.on(EVENTS.SYSTEM_STATUS, (data) => {
      this.ui.updateSystemStatus(data);
      this.ui.log("System Status", JSON.stringify(data, null, 2), "success");
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

    socket.on(EVENTS.NOTIFICATION, (data) => {
      this.ui.log("Notification", JSON.stringify(data, null, 2), "warning");
    });

    socket.on(EVENTS.ERROR, (data) => {
      this.ui.log("Error", JSON.stringify(data, null, 2), "error");
    });

    // Session events
    socket.on(EVENTS.SESSION_STARTED, (data) => {
      this.ui.log(
        "Session",
        JSON.stringify(data, null, 2),
        data.status === "success" ? "success" : "error",
      );
      if (data.status === "success" && data.session_id) {
        this.ui.setCurrentSession(data.session_id);
      }
    });

    socket.on(EVENTS.SESSION_ENDED, (data) => {
      this.ui.log(
        "Session",
        JSON.stringify(data, null, 2),
        data.status === "success" ? "success" : "error",
      );
      this.ui.resetSession();
    });

    socket.on(EVENTS.SESSION_UPDATE, (data) => {
      this.ui.log("Session Update", JSON.stringify(data, null, 2), "warning");
      if (data.type === "session_complete" && data.final_response) {
        this.ui.addChatMessage(
          "system",
          `Final Response: ${data.final_response}`,
        );
        if (data.profile) {
          this.ui.displayProfile({ visitor_profile: data.profile });
        }
      }
    });

    socket.on(EVENTS.PROFILE_DATA, (data) => {
      this.ui.log("Profile Data", JSON.stringify(data, null, 2), "success");
      this.ui.displayProfile(data);
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
