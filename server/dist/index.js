// Security Gate System Socket.IO Tester
class SecurityGateTester {
  constructor() {
    this.socket = null;
    this.currentSessionId = null;
    this.isConnected = false;
    this.autoScroll = true;

    this.initializeElements();
    this.attachEventListeners();
    this.connectToServer();
  }

  initializeElements() {
    // Connection status
    this.connectionStatus = document.getElementById("connection-status");
    this.systemStatus = document.getElementById("system-status");

    // Session management
    this.currentSessionIdDisplay =
      document.getElementById("current-session-id");
    this.startSessionBtn = document.getElementById("start-session-btn");
    this.endSessionBtn = document.getElementById("end-session-btn");
    this.getProfileBtn = document.getElementById("get-profile-btn");

    // Chat interface
    this.chatMessages = document.getElementById("chat-messages");
    this.chatForm = document.getElementById("chat-form");
    this.chatInput = document.getElementById("chat-input");

    // Image upload
    this.imageInput = document.getElementById("image-input");
    this.uploadBtn = document.getElementById("upload-btn");
    this.uploadStatus = document.getElementById("upload-status");

    // Session subscription
    this.joinUpdatesBtn = document.getElementById("join-updates-btn");
    this.leaveUpdatesBtn = document.getElementById("leave-updates-btn");

    // System operations
    this.healthCheckBtn = document.getElementById("health-check-btn");
    this.threatLogsBtn = document.getElementById("threat-logs-btn");

    // Profile display
    this.profileDisplay = document.getElementById("profile-display");

    // Logs
    this.eventLogs = document.getElementById("event-logs");
    this.clearLogsBtn = document.getElementById("clear-logs-btn");
    this.autoScrollCheckbox = document.getElementById("auto-scroll");
    this.threatLogs = document.getElementById("threat-logs");
  }

  attachEventListeners() {
    // Session management
    this.startSessionBtn.addEventListener("click", () => this.startSession());
    this.endSessionBtn.addEventListener("click", () => this.endSession());
    this.getProfileBtn.addEventListener("click", () => this.getProfile());

    // Chat interface
    this.chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // Image upload
    this.uploadBtn.addEventListener("click", () => this.uploadImage());

    // Session subscription
    this.joinUpdatesBtn.addEventListener("click", () =>
      this.joinSessionUpdates(),
    );
    this.leaveUpdatesBtn.addEventListener("click", () =>
      this.leaveSessionUpdates(),
    );

    // System operations
    this.healthCheckBtn.addEventListener("click", () =>
      this.requestHealthCheck(),
    );
    this.threatLogsBtn.addEventListener("click", () =>
      this.requestThreatLogs(),
    );

    // Logs
    this.clearLogsBtn.addEventListener("click", () => this.clearLogs());
    this.autoScrollCheckbox.addEventListener("change", (e) => {
      this.autoScroll = e.target.checked;
    });
  }

  connectToServer() {
    this.socket = io("http://localhost:8001");

    // Connection events
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.updateConnectionStatus();
      this.logEvent(
        "Connection",
        "Connected to Security Gate System",
        "success",
      );
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      this.updateConnectionStatus();
      this.logEvent("Connection", "Disconnected from server", "error");
      this.resetSession();
    });

    // Initial connection events
    this.socket.on("status", (data) => {
      this.logEvent("Status", JSON.stringify(data, null, 2));
    });

    this.socket.on("system_status", (data) => {
      this.updateSystemStatus(data);
      this.logEvent("System Status", JSON.stringify(data, null, 2), "success");
    });

    // Session events
    this.socket.on("session_started", (data) => {
      this.handleSessionStarted(data);
    });

    this.socket.on("session_ended", (data) => {
      this.handleSessionEnded(data);
    });

    this.socket.on("chat_response", (data) => {
      this.handleChatResponse(data);
    });

    this.socket.on("profile_data", (data) => {
      this.handleProfileData(data);
    });

    this.socket.on("session_update", (data) => {
      this.handleSessionUpdate(data);
    });

    // Image upload events
    this.socket.on("image_upload_response", (data) => {
      this.handleImageUploadResponse(data);
    });

    // System events
    this.socket.on("health_status", (data) => {
      this.logEvent("Health Check", JSON.stringify(data, null, 2), "success");
    });

    this.socket.on("threat_logs", (data) => {
      this.handleThreatLogs(data);
    });

    // General events
    this.socket.on("notification", (data) => {
      this.logEvent("Notification", JSON.stringify(data, null, 2), "warning");
    });

    this.socket.on("error", (data) => {
      this.logEvent("Error", JSON.stringify(data, null, 2), "error");
    });
  }

  updateConnectionStatus() {
    if (this.isConnected) {
      this.connectionStatus.textContent = "Connected";
      this.connectionStatus.classList.add("connected");
    } else {
      this.connectionStatus.textContent = "Disconnected";
      this.connectionStatus.classList.remove("connected");
    }
  }

  updateSystemStatus(data) {
    if (data) {
      this.systemStatus.textContent = `Health: ${data.healthy ? "Good" : "Issues"} | Active Sessions: ${data.active_sessions || 0}`;
    }
  }

  // Session Management
  startSession() {
    if (!this.isConnected) {
      this.logEvent("Error", "Not connected to server", "error");
      return;
    }

    this.socket.emit("start_session", {});
    this.logEvent("Action", "Starting new session...");
  }

  endSession() {
    if (!this.currentSessionId) {
      this.logEvent("Error", "No active session", "error");
      return;
    }

    this.socket.emit("end_session", { session_id: this.currentSessionId });
    this.logEvent("Action", `Ending session: ${this.currentSessionId}`);
  }

  getProfile() {
    if (!this.currentSessionId) {
      this.logEvent("Error", "No active session", "error");
      return;
    }

    this.socket.emit("get_profile", { session_id: this.currentSessionId });
    this.logEvent(
      "Action",
      `Getting profile for session: ${this.currentSessionId}`,
    );
  }

  sendMessage() {
    if (!this.currentSessionId) {
      this.logEvent("Error", "No active session", "error");
      return;
    }

    const message = this.chatInput.value.trim();
    if (!message) return;

    this.socket.emit("send_message", {
      session_id: this.currentSessionId,
      message: message,
    });

    this.addChatMessage("user", message);
    this.chatInput.value = "";
    this.logEvent("Chat", `Sent message: ${message}`);
  }

  uploadImage() {
    if (!this.currentSessionId) {
      this.logEvent("Error", "No active session", "error");
      return;
    }

    const file = this.imageInput.files[0];
    if (!file) {
      this.logEvent("Error", "No image file selected", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result.split(",")[1]; // Remove data:image/jpeg;base64, prefix

      this.socket.emit("upload_image", {
        session_id: this.currentSessionId,
        image: base64Data,
        timestamp: new Date().toISOString(),
      });

      this.updateUploadStatus("Uploading image...", "");
      this.logEvent("Action", `Uploading image: ${file.name}`);
    };

    reader.readAsDataURL(file);
  }

  joinSessionUpdates() {
    if (!this.currentSessionId) {
      this.logEvent("Error", "No active session", "error");
      return;
    }

    this.socket.emit("join_session_updates", {
      session_id: this.currentSessionId,
    });
    this.logEvent(
      "Action",
      `Joining updates for session: ${this.currentSessionId}`,
    );
  }

  leaveSessionUpdates() {
    if (!this.currentSessionId) {
      this.logEvent("Error", "No active session", "error");
      return;
    }

    this.socket.emit("leave_session_updates", {
      session_id: this.currentSessionId,
    });
    this.logEvent(
      "Action",
      `Leaving updates for session: ${this.currentSessionId}`,
    );
  }

  requestHealthCheck() {
    this.socket.emit("request_health_check", {});
    this.logEvent("Action", "Requesting health check...");
  }

  requestThreatLogs() {
    this.socket.emit("request_threat_logs", {});
    this.logEvent("Action", "Requesting threat logs...");
  }

  // Event Handlers
  handleSessionStarted(data) {
    this.logEvent(
      "Session",
      JSON.stringify(data, null, 2),
      data.status === "success" ? "success" : "error",
    );

    if (data.status === "success" && data.session_id) {
      this.currentSessionId = data.session_id;
      this.updateSessionUI(true);
    }
  }

  handleSessionEnded(data) {
    this.logEvent(
      "Session",
      JSON.stringify(data, null, 2),
      data.status === "success" ? "success" : "error",
    );
    this.resetSession();
  }

  handleChatResponse(data) {
    this.logEvent("Chat Response", JSON.stringify(data, null, 2), "success");

    if (data.agent_response) {
      this.addChatMessage("agent", data.agent_response);
    }

    if (data.session_complete) {
      this.addChatMessage("system", "Session completed!");
    }
  }

  handleProfileData(data) {
    this.logEvent("Profile Data", JSON.stringify(data, null, 2), "success");
    this.displayProfile(data);
  }

  handleSessionUpdate(data) {
    this.logEvent("Session Update", JSON.stringify(data, null, 2), "warning");

    if (data.type === "session_complete" && data.final_response) {
      this.addChatMessage("system", `Final Response: ${data.final_response}`);
      if (data.profile) {
        this.displayProfile({ visitor_profile: data.profile });
      }
    }
  }

  handleImageUploadResponse(data) {
    this.logEvent(
      "Image Upload",
      JSON.stringify(data, null, 2),
      data.status === "success" ? "success" : "error",
    );
    this.updateUploadStatus(data.message, data.status);

    if (data.status === "success") {
      this.imageInput.value = ""; // Clear the file input
    }
  }

  handleThreatLogs(data) {
    this.logEvent(
      "Threat Logs",
      `Received ${Array.isArray(data) ? data.length : 0} log entries`,
      "success",
    );
    this.displayThreatLogs(data);
  }

  // UI Updates
  updateSessionUI(hasSession) {
    this.currentSessionIdDisplay.textContent = hasSession
      ? this.currentSessionId
      : "None";

    // Enable/disable session-dependent controls
    const sessionControls = [
      this.endSessionBtn,
      this.getProfileBtn,
      this.chatInput,
      this.chatForm.querySelector('button[type="submit"]'),
      this.imageInput,
      this.uploadBtn,
      this.joinUpdatesBtn,
      this.leaveUpdatesBtn,
    ];

    sessionControls.forEach((control) => {
      if (control) {
        control.disabled = !hasSession;
      }
    });
  }

  resetSession() {
    this.currentSessionId = null;
    this.updateSessionUI(false);
    this.clearChat();
    this.clearProfile();
    this.clearUploadStatus();
  }

  addChatMessage(type, message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;

    const typeSpan = document.createElement("div");
    typeSpan.className = "message-type";
    typeSpan.textContent = type.toUpperCase();

    const contentDiv = document.createElement("div");
    contentDiv.textContent = message;

    messageDiv.appendChild(typeSpan);
    messageDiv.appendChild(contentDiv);

    this.chatMessages.appendChild(messageDiv);

    if (this.autoScroll) {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
  }

  clearChat() {
    this.chatMessages.innerHTML = "";
  }

  displayProfile(data) {
    if (data && data.visitor_profile) {
      this.profileDisplay.textContent = JSON.stringify(data, null, 2);
    } else {
      this.profileDisplay.textContent = "No profile data available";
    }
  }

  clearProfile() {
    this.profileDisplay.textContent = "No profile data available";
  }

  updateUploadStatus(message, status) {
    this.uploadStatus.textContent = message;
    this.uploadStatus.className = status ? `${status}` : "";
  }

  clearUploadStatus() {
    this.uploadStatus.textContent = "";
    this.uploadStatus.className = "";
  }

  displayThreatLogs(logs) {
    if (Array.isArray(logs) && logs.length > 0) {
      this.threatLogs.textContent = JSON.stringify(logs, null, 2);
    } else {
      this.threatLogs.textContent = "No threat logs available";
    }
  }

  logEvent(event, data, type = "") {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry ${type}`;

    const timestampSpan = document.createElement("span");
    timestampSpan.className = "log-timestamp";
    timestampSpan.textContent = `[${timestamp}] `;

    const eventSpan = document.createElement("span");
    eventSpan.className = "log-event";
    eventSpan.textContent = `${event}: `;

    const dataSpan = document.createElement("div");
    dataSpan.className = "log-data";
    dataSpan.textContent = data;

    logEntry.appendChild(timestampSpan);
    logEntry.appendChild(eventSpan);
    logEntry.appendChild(dataSpan);

    this.eventLogs.appendChild(logEntry);

    if (this.autoScroll) {
      this.eventLogs.scrollTop = this.eventLogs.scrollHeight;
    }
  }

  clearLogs() {
    this.eventLogs.innerHTML = "";
  }
}

// Initialize the tester when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new SecurityGateTester();
});
