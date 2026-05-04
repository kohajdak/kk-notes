# KK-Notes: Online Journal Application

A simple and secure online journal application where users can write, edit, and manage private notes. Built with Express.js, PostgreSQL, and React.

## Features

### Core Features
- ✅ **Create Notes** - Write and save personal journal entries
- ✅ **List Notes** - View all notes in chronological order (newest first)
- ✅ **Search Notes** - Find notes by content using full-text search
- ✅ **Filter by Tags** - Organize and filter notes by custom tags
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
- ✅ **Persistent Storage** - All notes stored securely in PostgreSQL

### Additional Features
- ✅ Edit notes in place
- ✅ Delete notes from the UI
- ✅ Clear filter support for search and tags
- ✅ Color selection for note backgrounds
- User authentication for private access
- Note categorization system
- Offline availability with Service Workers

## Technology Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js 5.x
- **ORM**: Sequelize 6.x (PostgreSQL)
- **Testing**: Jest with Supertest
- **Linting**: ESLint

### Frontend
- **Framework**: React 19.x
- **Build Tool**: Vite 8.x
- **Styling**: CSS3

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15
- **CI/CD**: GitHub Actions

## Project Structure

```
kk-notes/
├── backend/                    # Express API server
│   ├── config/                # Database configuration
│   │   └── config.js         # Sequelize config for dev/test/prod
│   ├── models/               # Sequelize models
│   │   ├── entry.js          # Entry (Note) model
│   │   └── index.js          # Model initialization
│   ├── migrations/           # Database migrations
│   │   └── 20260502112206-create-entry.js
│   ├── tests/                # Test suites
│   │   ├── entry.model.test.js
│   │   ├── entries.test.js
│   │   └── entries.integration.test.js
│   ├── Dockerfile            # Backend container image
│   ├── db.js                 # Database connection setup
│   ├── index.js              # Express app & routes
│   └── package.json
├── frontend/                  # React application
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/               # Static assets
│   ├── vite.config.js
│   └── package.json
├── db/                       # Database utilities
│   └── schema.sql           # Initial schema (legacy)
├── docker-compose.yml        # Multi-container orchestration
├── .github/workflows/        # CI/CD pipelines
│   └── backend-ci.yml       # Testing & deployment automation
├── .env                      # Environment variables (not in git)
└── README.md                 # This file
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL 15+ (if running without Docker)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kk-notes
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env .env  # or create with your values
   ```
   
   Required variables:
   ```
   DB_USER=app
   DB_PASSWORD=secret
   DB_NAME=notes
   DB_HOST=db
   DB_PORT=5432
   ```

3. **Start services**
   ```bash
   docker-compose up -d --build
   ```

4. **Run migrations**
   ```bash
   docker-compose exec backend npx sequelize-cli db:migrate
   ```

5. **Access the application**
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:5173 (when built)

### Local Development Setup

1. **Backend**
   ```bash
   cd backend
   npm ci
   npm run dev  # Starts with nodemon
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm ci
   npm run dev  # Starts Vite dev server
   ```

3. **Database (Local PostgreSQL)**
   ```bash
   # Set DATABASE_URL or DB_* environment variables
   export DATABASE_URL="postgres://app:secret@localhost:5432/notes"
   npx sequelize-cli db:migrate
   ```

## Testing

### Run All Tests
```bash
cd backend
npm test -- --coverage
```

### Test Coverage
- **Line Coverage**: 77.58%
- **Branch Coverage**: 38.23%
- **Function Coverage**: 70%
- **3 test suites**: All passing ✅

### Test Types
- **Unit Tests**: `entry.model.test.js` - Model validation
- **Integration Tests**: `entries.integration.test.js` - API endpoints
- **Route Tests**: `entries.test.js` - HTTP behavior

## API Endpoints

See [API.md](./API.md) for detailed endpoint documentation.

### Quick Reference
- `GET /api/entries` - List all notes with optional search/filter
- `POST /api/entries` - Create a new note
- `PUT /api/entries/:id` - Update an existing note
- `DELETE /api/entries/:id` - Delete a note

## Environment Configuration

### Development
- Auto-syncs database schema via `sequelize.sync()`
- Detailed logging enabled
- Hot reload available with `npm run dev`

### Production
- Requires explicit migrations: `sequelize-cli db:migrate`
- No auto-sync (safer for production)
- Environment variables loaded from `.env`

### Test
- Separate test database (`notes_test`)
- Isolated test schema per run
- Coverage reporting enabled

## CI/CD Pipeline

GitHub Actions workflow runs on every push/PR:
1. ✅ Install dependencies
2. ✅ Lint code (ESLint)
3. ✅ Spin up PostgreSQL service
4. ✅ Run database migrations
5. ✅ Run test suite with coverage
6. ✅ Build Docker image
7. ✅ Upload artifacts (coverage report + Docker image)

**Status**: Pipeline working ✅

## Database Schema

### Entries Table
```sql
CREATE TABLE Entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR,
  body TEXT NOT NULL,
  tags VARCHAR,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Model Fields
- `id` - Auto-incrementing primary key
- `title` - Optional note title (string)
- `body` - Note content (required, text)
- `tags` - Comma-separated tags (optional)
- `createdAt` - Timestamp (auto-managed)
- `updatedAt` - Timestamp (auto-managed)

## Security

### Best Practices Implemented
- ✅ Environment variables for sensitive data (.env in .gitignore)
- ✅ No hardcoded secrets in source code
- ✅ CORS considerations for multi-origin access
- ✅ Input validation on API endpoints
- ✅ SQL injection prevention via Sequelize ORM

### Future Security Enhancements
- User authentication & authorization
- HTTPS/TLS in production
- Rate limiting on API endpoints
- Input sanitization

## Docker Commands

### Build & Run
```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Database Access
```bash
# Connect to PostgreSQL
docker-compose exec db psql -U app -d notes

# List tables
docker-compose exec db psql -U app -d notes -c "\dt"
```

### Backend Container
```bash
# Run migrations
docker-compose exec backend npx sequelize-cli db:migrate

# Run tests
docker-compose exec backend npm test -- --coverage

# Shell access
docker-compose exec backend sh
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` environment variable is set
- Check `.env` file exists in project root
- Ensure PostgreSQL container is healthy: `docker-compose ps`

### Migration Failures
- Verify PostgreSQL is running and accessible
- Check migration file syntax
- Review logs: `docker-compose logs db`

### Test Failures
- Ensure test database exists
- Clear test data: `docker-compose down -v`
- Check isolation between tests

### Port Already in Use
- Change ports in `docker-compose.yml`
- Or stop conflicting services: `docker ps` then `docker stop <container>`

## Performance

- **Startup Time**: ~6 seconds (with container health checks)
- **Test Suite**: ~1.5 seconds
- **API Response**: <100ms (typical)
- **Database Queries**: Indexed on primary key

## Contributing

- Follow ESLint rules: `npm run lint`
- Write tests for new features
- Update documentation for API changes
- Use meaningful commit messages
- Create feature branches from `main`

## License

ISC

## Author

Created for educational purposes as a fullstack JavaScript application showcase.

---

**Last Updated**: May 3, 2026
**Node Version**: 20.20.2
**Database**: PostgreSQL 15
