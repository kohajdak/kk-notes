# API Documentation

## Base URL

```
http://localhost:3000
```

## Overview

The KK-Notes API provides simple CRUD endpoints for managing notes. All requests and responses use JSON. This document describes the current, minimal implementation for a course assignment.

## Authentication

Currently, **no authentication is required**.

## Content Type

All requests should include:
```
Content-Type: application/json
```

## Error Handling

### Error Response Format
```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes
- `400` - Bad Request (validation failed)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Endpoints

### 1. List All Entries

Retrieves all notes with optional search and filtering.

#### Request
```
GET /api/entries?q=<query>&tag=<tag>
```

#### Query Parameters (Optional)
| Parameter | Type   | Description |
|-----------|--------|-------------|
| `q`       | string | Search notes by content (case-insensitive) |
| `tag`     | string | Filter notes by specific tag |

#### Examples

**Get all entries**
```bash
curl http://localhost:3000/api/entries
```

**Search by content**
```bash
curl 'http://localhost:3000/api/entries?q=important'
```

**Filter by tag**
```bash
curl 'http://localhost:3000/api/entries?tag=work'
```

**Combine search and filter**
```bash
curl 'http://localhost:3000/api/entries?q=meeting&tag=work'
```

#### Response

**Status**: `200 OK`

**Body** (Array of entries, newest first):
```json
[
  {
    "id": 3,
    "body": "Discussed Q2 roadmap and timelines",
    "tags": "work,meeting",
    "backgroundColor": "#B3E5FC",
    "createdAt": "2026-05-03T15:30:00.000Z",
    "updatedAt": "2026-05-03T15:30:00.000Z"
  },
  {
    "id": 2,
    "body": "Reflection on today's events",
    "tags": "personal",
    "backgroundColor": "#FFE082",
    "createdAt": "2026-05-02T12:00:00.000Z",
    "updatedAt": "2026-05-02T12:00:00.000Z"
  }
]
```

#### Notes
- Results are ordered by `created_at DESC` (newest first)
- Search uses case-insensitive pattern matching on `body` field
- Tag filtering matches exact tag value
- Returns empty array `[]` if no entries match criteria

---

### 2. Create Entry

Creates a new note.

#### Request
```
POST /api/entries
```

#### Request Body
```json
{
  "body": "string (required)",
  "tags": "string (optional, comma-separated)",
  "backgroundColor": "string (optional, hex color)"
}
```

#### Request Fields
| Field | Type   | Required | Description |
|-------|--------|----------|-------------|
| `body` | string | Yes | Content of the note (required) |
| `tags` | string | No | Comma-separated tags for categorization |
| `backgroundColor` | string | No | Background color hex code for the note |

#### Examples

**Minimal request**
```bash
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "body": "Today I learned about REST APIs"
  }'
```

**Complete request**
```bash
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "body": "Today I learned about REST APIs and how to document them",
    "tags": "learning,api,rest",
    "backgroundColor": "#FFE082"
  }'
```

#### Response

**Status**: `201 Created`

**Body**:
```json
{
  "id": 4,
  "body": "Today I learned about REST APIs and how to document them",
  "tags": "learning,api,rest",
  "backgroundColor": "#FFE082",
  "createdAt": "2026-05-03T16:45:22.123Z",
  "updatedAt": "2026-05-03T16:45:22.123Z"
}
```

#### Error Response

**Status**: `400 Bad Request` (missing body)

**Body**:
```json
{
  "error": "body is required"
}
```

#### Notes
- `body` field is mandatory; request without it returns 400 error
- `id`, `createdAt`, and `updatedAt` are auto-generated
- Maximum recommended content length: 10,000 characters per note
- Tags are stored as-is (no validation on format)

---

## Update Entry (PUT)
Update an existing note by ID.

### Request
```
PUT /api/entries/:id
```

### Request Body
```json
{
  "body": "string (required)",
  "tags": "string (optional, comma-separated)",
  "backgroundColor": "string (optional, hex color)"
}
```

### Response
**Status**: `200 OK`

```json
{
  "id": 3,
  "body": "Updated note content",
  "tags": "work,updated",
  "backgroundColor": "#B3E5FC",
  "createdAt": "2026-05-03T15:30:00.000Z",
  "updatedAt": "2026-05-03T16:30:00.000Z"
}
```

### Error Responses
- `400 Bad Request` when `body` is missing
- `404 Not Found` when the note ID does not exist

---

## Delete Entry (DELETE)
Delete a note by ID.

### Request
```
DELETE /api/entries/:id
```

### Response
**Status**: `204 No Content`

### Error Responses
- `404 Not Found` when the note ID does not exist

---

## Testing Endpoints

### Using curl
```bash
# Get all entries
curl http://localhost:3000/api/entries

# Create entry
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{"body":"Test entry","tags":"test"}'
```

### Using Postman
1. Create new collection "KK-Notes"
2. Import these requests
3. Set base URL: `http://localhost:3000`

### Using fetch (JavaScript)
```javascript
// Get entries
fetch('/api/entries')
  .then(res => res.json())
  .then(data => console.log(data));

// Create entry
fetch('/api/entries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    body: 'Note content here',
    tags: 'personal,note'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Response Headers

All responses include:
```
Content-Type: application/json
```

---

## Support

For issues or questions:
1. Check the [README.md](./README.md) for setup instructions
2. Review test files for usage examples
3. Check logs: `docker-compose logs backend`

---

**Last Updated**: May 05, 2026