export class UIManager {
  constructor() {
    this.currentSessionId = null;
    this.autoScroll = true;
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    // Connection status
    this.connectionStatus = document.getElementById('connection-status');
    this.systemStatus = document.getElementById('system-status');

    // Session management
    this.currentSessionIdDisplay = document.getElementById('current-session-id');
    this.startSessionBtn = document.getElementById('start-session-btn');
    this.endSessionBtn = document.getElementById('end-session-btn');
    this.getProfileBtn = document.getElementById('get-profile-btn');

    // Chat interface
    this.chatMessages = document.getElementById('chat-messages');
    this.chatForm = document.getElementById('chat-form');
    this.chatInput = document.getElementById('chat-input');

    // Image upload
    this.imageInput = document.getElementById('image-input');
    this.uploadBtn = document.getElementById('upload-btn');
    this.uploadStatus = document.getElementById('upload-status');

    // Session subscription
    this.joinUpdatesBtn = document.getElementById('join-updates-btn');
    this.leaveUpdatesBtn = document.getElementById('leave-updates-btn');

    // System operations
    this.healthCheckBtn = document.getElementById('health-check-btn');
    this.threatLogsBtn = document.getElementById('threat-logs-btn');

    // Profile display
    this.profileDisplay = document.getElementById('profile-display');

    // Logs
    this.eventLogs = document.getElementById('event-logs');
    this.clearLogsBtn = document.getElementById('clear-logs-btn');
    this.autoScrollCheckbox = document.getElementById('auto-scroll');
    this.threatLogs = document.getElementById('threat-logs');
  }

  setupEventListeners() {
    this.autoScrollCheckbox.addEventListener('change', (e) => {
      this.autoScroll = e.target.checked;
    });
  }

  updateConnectionStatus(isConnected) {
    this.connectionStatus.textContent = isConnected ? 'Connected' : 'Disconnected';
    this.connectionStatus.classList.toggle('connected', isConnected);
  }

  updateSystemStatus(data) {
    if (data) {
      this.systemStatus.textContent = `Health: ${data.healthy ? 'Good' : 'Issues'} | Active Sessions: ${data.active_sessions || 0}`;
    }
  }

  setCurrentSession(sessionId) {
    this.currentSessionId = sessionId;
    this.updateSessionUI(true);
  }

  resetSession() {
    this.currentSessionId = null;
    this.updateSessionUI(false);
    this.clearChat();
    this.clearProfile();
    this.clearUploadStatus();
  }

  updateSessionUI(hasSession) {
    this.currentSessionIdDisplay.textContent = hasSession ? this.currentSessionId : 'None';

    const sessionControls = [
      this.endSessionBtn,
      this.getProfileBtn,
      this.chatInput,
      this.chatForm?.querySelector('button[type="submit"]'),
      this.imageInput,
      this.uploadBtn,
      this.joinUpdatesBtn,
      this.leaveUpdatesBtn
    ];

    sessionControls.forEach(control => {
      if (control) control.disabled = !hasSession;
    });
  }

  addChatMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const typeSpan = document.createElement('div');
    typeSpan.className = 'message-type';
    typeSpan.textContent = type.toUpperCase();

    const contentDiv = document.createElement('div');
    contentDiv.textContent = message;

    messageDiv.appendChild(typeSpan);
    messageDiv.appendChild(contentDiv);
    this.chatMessages.appendChild(messageDiv);

    if (this.autoScroll) {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
  }

  clearChat() {
    this.chatMessages.innerHTML = '';
  }

  displayProfile(data) {
    this.profileDisplay.textContent = data?.visitor_profile ?
      JSON.stringify(data, null, 2) : 'No profile data available';
  }

  clearProfile() {
    this.profileDisplay.textContent = 'No profile data available';
  }

  updateUploadStatus(message, status) {
    this.uploadStatus.textContent = message;
    this.uploadStatus.className = status || '';
  }

  clearUploadStatus() {
    this.uploadStatus.textContent = '';
    this.uploadStatus.className = '';
  }

  clearImageInput() {
    this.imageInput.value = '';
  }

  displayThreatLogs(logs) {
    this.threatLogs.textContent = Array.isArray(logs) && logs.length > 0 ?
      JSON.stringify(logs, null, 2) : 'No threat logs available';
  }

  log(event, data, type = '') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
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
    this.eventLogs.innerHTML = '';
  }

  getCurrentSessionId() {
    return this.currentSessionId;
  }

  getChatInputValue() {
    return this.chatInput.value.trim();
  }

  clearChatInput() {
    this.chatInput.value = '';
  }

  getSelectedFile() {
    return this.imageInput.files[0];
  }
}
