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

## Example

- curl -X POST http://localhost:3000/api/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from REST API!"}'

- curl http://localhost:3000/api/getMessages
