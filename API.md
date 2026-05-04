# API Documentation

## Base URL

```
http://localhost:3000
```

### Production
```
http://<your-domain>:3000
```

## Overview

The KK-Notes API provides endpoints for managing journal entries (notes). All requests and responses use JSON format.

## Authentication

Currently, **no authentication is required**. 

**Future Implementation**: JWT tokens will be implemented for user-specific note management.

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

Retrieves all journal entries with optional search and filtering.

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
    "title": "Important Meeting",
    "body": "Discussed Q2 roadmap and timelines",
    "tags": "work,meeting",
    "createdAt": "2026-05-03T15:30:00.000Z",
    "updatedAt": "2026-05-03T15:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Personal Thoughts",
    "body": "Reflection on today's events",
    "tags": "personal",
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

Creates a new journal entry.

#### Request
```
POST /api/entries
```

#### Request Body
```json
{
  "title": "string (optional)",
  "body": "string (required)",
  "tags": "string (optional, comma-separated)"
}
```

#### Request Fields
| Field | Type   | Required | Description |
|-------|--------|----------|-------------|
| `body` | string | Yes | Content of the note (required) |
| `title` | string | No | Title/headline of the note |
| `tags` | string | No | Comma-separated tags for categorization |

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
    "title": "Learning Log",
    "body": "Today I learned about REST APIs and how to document them",
    "tags": "learning,api,rest"
  }'
```

#### Response

**Status**: `201 Created`

**Body**:
```json
{
  "id": 4,
  "title": "Learning Log",
  "body": "Today I learned about REST APIs and how to document them",
  "tags": "learning,api,rest",
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

## Future Endpoints (Planned)

### 3. Update Entry (PUT)
```
PUT /api/entries/:id
```

### 4. Delete Entry (DELETE)
```
DELETE /api/entries/:id
```

### 5. User Authentication (POST)
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

---

## Rate Limiting

Currently **not implemented**.

**Future**: 100 requests per minute per IP address.

---

## Pagination

Currently **not implemented**.

**Future**: Support for `limit` and `offset` query parameters.

---

## Testing Endpoints

### Using curl
```bash
# Get all entries
curl http://localhost:3000/api/entries

# Create entry
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{"body":"Test entry","title":"Test","tags":"test"}'
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
    title: 'My Note',
    body: 'Note content here',
    tags: 'personal,journal'
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

## Changelog

### Version 1.0.0 (Current)
- ✅ GET /api/entries with search & filter
- ✅ POST /api/entries
- ✅ Full test coverage
- ✅ Docker deployment ready

### Planned Features
- User authentication
- PUT/DELETE endpoints
- Pagination
- Advanced search filters
- Rate limiting

---

## Support

For issues or questions:
1. Check the [README.md](./README.md) for setup instructions
2. Review test files for usage examples
3. Check logs: `docker-compose logs backend`

---

**Last Updated**: May 3, 2026
**API Version**: 1.0.0
