// Socket.IO Event Constants
export const EVENTS = {
  // Connection Events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",

  // Outgoing Events (Client -> Server)
  SEND_MESSAGE: "chat_message",
  REQUEST_HEALTH_CHECK: "health",
  REQUEST_LOGS: "logs",
  FRAME_RESPONSE: "frame_response",

  // Incoming Events (Server -> Client)
  CHAT_RESPONSE: "chat_response",
  HEALTH_STATUS: "health_response",
  LOGS: "logs_response",
  FRAME_REQUEST: "frame_request",
};
