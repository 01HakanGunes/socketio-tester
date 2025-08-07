# API Documentation

## REST Endpoints

### GET /api/getMessages

Returns the current message queue and response string.

**Response:**

```json
{
  "messages": [...],
  "responseString": "string"
}
```

### POST /api/sendMessage

Sends a message to all connected Socket.IO clients.

**Request Body:**

```json
{
  "message": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "sentMessage": "string"
}
```

### GET /api/getLatestFrame

Returns and removes the latest frame from the frame queue.

**Response:**

```json
{
  "success": true,
  "frame": {
    "id": 1234567890,
    "image": "base64_string",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "socketId": "socket_id"
  },
  "remainingCount": 5
}
```

**Error Response (No frames available):**

```json
{
  "error": "No frames available"
}
```

## Example

- curl -X POST http://localhost:3000/api/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from REST API!"}'

- curl http://localhost:3000/api/getMessages

- curl http://localhost:3000/api/getLatestFrame
