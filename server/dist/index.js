import { SocketManager } from "./socketManager.js";
import { UIManager } from "./uiManager.js";

class SecurityGateTester {
  constructor() {
    this.ui = new UIManager();
    this.socket = new SocketManager(this.ui);
    this.attachEventListeners();
    this.socket.connect();
  }

  attachEventListeners() {
    // Chat interface
    this.ui.chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.ui.getChatInputValue();
      if (!message) return;

      this.socket.sendMessage(message);
      this.ui.clearChatInput();
    });

    // Image upload
    this.ui.uploadBtn.addEventListener("click", () => {
      this.socket.uploadImage(this.ui.getSelectedFile());
    });

    // System operations
    this.ui.healthCheckBtn.addEventListener("click", () =>
      this.socket.requestHealthCheck(),
    );
    this.ui.logsBtn.addEventListener("click", () => this.socket.requestLogs());

    // Camera controls
    this.ui.initCameraBtn.addEventListener("click", () =>
      this.socket.initializeCamera(),
    );

    // Logs
    this.ui.clearLogsBtn.addEventListener("click", () => this.ui.clearLogs());
  }
}

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", () => new SecurityGateTester());
