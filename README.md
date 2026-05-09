# KK-Notes: The Note Application

A simple note application for creating, editing and managing private notes. Built with Express.js, PostgreSQL, and React.

## Features

### Core Features
- **Create Notes** - Write and save personal notes
- **Edit Notes** - Update existing notes in place
- **Delete Notes** - Remove notes from the application
- **Search Notes** - Find notes by content using full-text search

### Additional Features
- Filter notes by custom tags
- Clear search and tag filters
- Color selection for note backgrounds
- Responsive design on desktop and mobile
- Notes stored securely in PostgreSQL

## Technology Stack

### Backend
- **Runtime**: Node.js 24.15.0 (LTS)
- **Framework**: Express.js 5.2.1
- **ORM**: Sequelize 6.37.8 (PostgreSQL)
- **Testing**: Jest with Supertest
- **Linting**: ESLint

### Frontend
- **Framework**: React 19.2.5
- **Build Tool**: Vite 8.0.10
- **Styling**: CSS3

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15
- **CI/CD**: GitHub Actions

## Project Structure

```
kk-notes/
├── .github/workflows/                    # CI/CD pipelines
│   └── backend-ci.yml                    # Testing & deployment automation
├── backend/                              # Express API server
│   ├── config/                           # Database configuration
│   │   └── config.js                     # Sequelize config for dev/
│   ├── migrations/                       # Database migrations
│   ├── models/                           # Sequelize models
│   │   ├── entry.js                      # Entry (Note) model
│   │   └── index.js                      # Model initialization
│   ├── tests/                            # Test suites
│   │   └── entries.integration.test.js   # Integration tests
│   │   ├── entries.test.js               # Route tests
│   │   ├── entry.model.test.js           # Unit tests
│   ├── db.js                             # Database connection setup
│   ├── Dockerfile                        # Backend container image
│   ├── eslint.config.mjs                 # ESLint config for backend
│   ├── index.js                          # Express app & routes
├── db/                                   # Database utilities
│   └── schema.sql                        # Initial schema
├── frontend/                             # React application
│   ├── public/                           # Static assets
│   ├── src/                              # Application source files
│   │   ├── App.css                       # App component styles
│   │   ├── App.jsx                       # Main app component
│   │   ├── index.css                     # Global styles and CSS variables
│   │   └── main.jsx                      # Entry point
│   ├── eslint.config.js                  # ESLint config for frontend
│   ├── README.md                         # React + Vite template documentation
│   └── vite.config.js                    # React integration file
├── API.md                                # API documentation
├── docker-compose.yml                    # Backend + database services
└── README.md                             # This file
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 24+ (for frontend and local development)
- PostgreSQL 15+ (if running without Docker)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kk-notes
   ```

2. **Set up environment variables**
   Create a `.env` file in the project root to provide local values:
   ```bash
   cat > .env <<EOF
   DB_USER=app
   DB_PASSWORD=secret
   DB_NAME=notes
   DB_NAME_TEST=notes_test
   DB_HOST=db
   DB_PORT=5432
   EOF
   ```

> Note: A valid variable name must contain only letters (uppercase or lowercase), digits and underscores (_) and it can't begin with a digit. Check https://nodejs.org/dist/v24.15.0/docs/api/environment_variables.html for more information.

3. **Start backend services**
   ```bash
   docker-compose up -d --build
   ```

4. **Install backend dependencies**
   ```bash
   docker-compose exec backend npm ci
   ```

5. **Run migrations**
   ```bash
   docker-compose exec backend npx sequelize-cli db:migrate
   ```

6. **Start the frontend**
   ```bash
   cd frontend
   npm ci
   npm run dev  # Starts Vite dev server on http://localhost:5173
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

> Note: `docker-compose.yml` starts only the backend and database. The frontend requires Node.js and must be started separately.

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

> Note: The test suite resets the database (calls sequelize.sync({ force: true })) and will delete existing rows. Run tests only against an empty test database or back up your data before running tests.

### Run All Tests with Docker
```bash
cd backend
docker-compose exec backend npm test -- --coverage
```

### Run All Tests locally
```bash
cd backend
npm test -- --coverage
```

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
- Environment variables loaded from `.env` file if present

### Test
- Separate test database (`notes_test`)
- Isolated test schema per run
- Coverage reporting enabled

## CI/CD Pipeline

GitHub Actions workflow runs on every push/PR:
1. Install dependencies
2. Lint code (ESLint)
3. Spin up PostgreSQL service
4. Run database migrations
5. Run test suite with coverage
6. Build Docker image
7. Upload artifacts (coverage report + Docker image)

**Status**: Pipeline working ✅

## Database Schema

### Entries Table
```sql
CREATE TABLE Entries (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  tags VARCHAR,
  backgroundColor VARCHAR DEFAULT '#FFE082',
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Model Fields
- `id` - Auto-incrementing primary key
- `body` - Note content (required, text)
- `tags` - Comma-separated tags (optional)
- `backgroundColor` - Hex color code for note background (default: '#FFE082')
- `createdAt` - Timestamp (auto-managed)
- `updatedAt` - Timestamp (auto-managed)

## Security

### Best Practices Implemented
- Environment variables for sensitive data (`.env`)
- No hardcoded secrets in source code
- CORS considerations for multi-origin access
- Input validation on API endpoints
- SQL injection prevention via Sequelize ORM


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
- Ensure required database env vars are available in root `.env` file
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

## Author

Created for educational purposes as a fullstack JavaScript application showcase.

---

**Last Updated**: May 10, 2026
