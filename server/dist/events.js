// Socket.IO Event Constants
export const EVENTS = {
  // Connection Events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",

  // Outgoing Events (Client -> Server)
  SEND_MESSAGE: "send_message",
  UPLOAD_IMAGE: "upload_image",
  REQUEST_HEALTH_CHECK: "request_health_check",
  REQUEST_THREAT_LOGS: "request_threat_logs",

  // Incoming Events (Server -> Client)
  CHAT_RESPONSE: "chat_response",
  IMAGE_UPLOAD_RESPONSE: "image_upload_response",
  HEALTH_STATUS: "health_status",
  THREAT_LOGS: "threat_logs",
};
