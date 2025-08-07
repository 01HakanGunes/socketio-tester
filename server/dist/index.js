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
    // Session management
    this.ui.startSessionBtn.addEventListener("click", () =>
      this.socket.startSession(),
    );
    this.ui.endSessionBtn.addEventListener("click", () =>
      this.socket.endSession(this.ui.getCurrentSessionId()),
    );
    this.ui.getProfileBtn.addEventListener("click", () =>
      this.socket.getProfile(this.ui.getCurrentSessionId()),
    );

    // Chat interface
    this.ui.chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = this.ui.getChatInputValue();
      if (!message) return;

      this.socket.sendMessage(this.ui.getCurrentSessionId(), message);
      this.ui.clearChatInput();
    });

    // Image upload
    this.ui.uploadBtn.addEventListener("click", () => {
      this.socket.uploadImage(
        this.ui.getCurrentSessionId(),
        this.ui.getSelectedFile(),
      );
    });

    // Session subscription
    this.ui.joinUpdatesBtn.addEventListener("click", () =>
      this.socket.joinSessionUpdates(this.ui.getCurrentSessionId()),
    );
    this.ui.leaveUpdatesBtn.addEventListener("click", () =>
      this.socket.leaveSessionUpdates(this.ui.getCurrentSessionId()),
    );

    // System operations
    this.ui.healthCheckBtn.addEventListener("click", () =>
      this.socket.requestHealthCheck(),
    );
    this.ui.threatLogsBtn.addEventListener("click", () =>
      this.socket.requestThreatLogs(),
    );

    // Logs
    this.ui.clearLogsBtn.addEventListener("click", () => this.ui.clearLogs());
  }
}

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", () => new SecurityGateTester());
