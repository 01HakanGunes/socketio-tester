export class UIManager {
  constructor() {
    this.autoScroll = true;
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    // Connection status
    this.connectionStatus = document.getElementById("connection-status");

    // Chat interface
    this.chatMessages = document.getElementById("chat-messages");
    this.chatForm = document.getElementById("chat-form");
    this.chatInput = document.getElementById("chat-input");

    // Image upload
    this.imageInput = document.getElementById("image-input");
    this.uploadBtn = document.getElementById("upload-btn");
    this.uploadStatus = document.getElementById("upload-status");

    // System operations
    this.healthCheckBtn = document.getElementById("health-check-btn");
    this.logsBtn = document.getElementById("logs-btn");

    // Logs
    this.eventLogs = document.getElementById("event-logs");
    this.clearLogsBtn = document.getElementById("clear-logs-btn");
    this.autoScrollCheckbox = document.getElementById("auto-scroll");
    this.logs = document.getElementById("logs");
  }

  setupEventListeners() {
    this.autoScrollCheckbox.addEventListener("change", (e) => {
      this.autoScroll = e.target.checked;
    });
  }

  updateConnectionStatus(isConnected) {
    this.connectionStatus.textContent = isConnected
      ? "Connected"
      : "Disconnected";
    this.connectionStatus.classList.toggle("connected", isConnected);
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

  updateUploadStatus(message, status) {
    this.uploadStatus.textContent = message;
    this.uploadStatus.className = status || "";
  }

  clearUploadStatus() {
    this.uploadStatus.textContent = "";
    this.uploadStatus.className = "";
  }

  clearImageInput() {
    this.imageInput.value = "";
  }

  displayLogs(logs) {
    this.logs.textContent =
      Array.isArray(logs) && logs.length > 0
        ? JSON.stringify(logs, null, 2)
        : "No logs available";
  }

  log(event, data, type = "") {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry ${type}`;

    logEntry.innerHTML = `
      <span class="log-timestamp">[${timestamp}] </span>
      <span class="log-event">${event}: </span>
      <div class="log-data">${data}</div>
    `;

    this.eventLogs.appendChild(logEntry);

    if (this.autoScroll) {
      this.eventLogs.scrollTop = this.eventLogs.scrollHeight;
    }
  }

  clearLogs() {
    this.eventLogs.innerHTML = "";
  }

  getChatInputValue() {
    return this.chatInput.value.trim();
  }

  clearChatInput() {
    this.chatInput.value = "";
  }

  getSelectedFile() {
    return this.imageInput.files[0];
  }
}
