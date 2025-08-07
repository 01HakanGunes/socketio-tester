// Socket.IO Event Constants
export const EVENTS = {
  // Connection Events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Outgoing Events (Client -> Server)
  START_SESSION: 'start_session',
  END_SESSION: 'end_session',
  GET_PROFILE: 'get_profile',
  SEND_MESSAGE: 'send_message',
  UPLOAD_IMAGE: 'upload_image',
  JOIN_SESSION_UPDATES: 'join_session_updates',
  LEAVE_SESSION_UPDATES: 'leave_session_updates',
  REQUEST_HEALTH_CHECK: 'request_health_check',
  REQUEST_THREAT_LOGS: 'request_threat_logs',

  // Incoming Events (Server -> Client)
  STATUS: 'status',
  SYSTEM_STATUS: 'system_status',
  SESSION_STARTED: 'session_started',
  SESSION_ENDED: 'session_ended',
  CHAT_RESPONSE: 'chat_response',
  PROFILE_DATA: 'profile_data',
  SESSION_UPDATE: 'session_update',
  IMAGE_UPLOAD_RESPONSE: 'image_upload_response',
  HEALTH_STATUS: 'health_status',
  THREAT_LOGS: 'threat_logs',
  NOTIFICATION: 'notification'
};
