# Docker Setup for Payload Logs

This application is fully containerized using Docker. All development, testing, and production tasks can be performed inside the Docker container.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### 1. Build and Start the Container

```bash
docker compose up -d --build
```

This will:
- Build the Docker image with all dependencies
- Install all npm packages including dev dependencies
- Install Playwright browsers for testing
- Start the container in detached mode
- Create persistent volumes for node_modules, cache, and data

### 2. Rebuild better-sqlite3 (First Time Only)

Since better-sqlite3 is a native module, it needs to be rebuilt for the container's architecture:

```bash
docker exec payload-app pnpm rebuild better-sqlite3
```

### 3. Run the Development Server

#### Option A: Using the helper script (recommended)

```bash
./payload.sh dev
```

#### Option B: Using docker exec directly

```bash
docker exec -it payload-app pnpm dev --host
```

The app will be available at http://localhost:8911

Press `Ctrl+C` to stop the dev server.

## Running Commands

### Using the Helper Script

The `payload.sh` script makes it easy to run commands:

```bash
./payload.sh <command>
```

Available commands:
- `dev` - Start development server
- `test` - Run tests
- `test:ui` - Run tests with UI
- `test:headed` - Run tests in headed mode
- `check` - Run typecheck + lint + tests
- `lint` - Run ESLint
- `typecheck` - Run TypeScript type checking
- `build` - Build for production
- `preview` - Preview production build
- `shell` - Access container shell
- `logs` - View container logs
- `restart` - Restart container
- `rebuild` - Rebuild and restart container
- `stop` - Stop container
- `start` - Start container
- `clean` - Stop and remove everything (including volumes)

### Using docker exec Directly

All pnpm commands can be run directly:

```bash
# Run tests
docker exec -it payload-app pnpm test

# Check for errors (typecheck + lint + tests)
docker exec -it payload-app pnpm check-errors

# Run linter
docker exec -it payload-app pnpm lint

# Type check
docker exec -it payload-app pnpm typecheck

# Build for production
docker exec -it payload-app pnpm build

# Preview production build
docker exec -it payload-app pnpm preview
```

## Container Management

### View Container Logs

```bash
docker logs payload-app -f
```

Or using the helper:
```bash
./payload.sh logs
```

### Access Container Shell

```bash
docker exec -it payload-app sh
```

Or using the helper:
```bash
./payload.sh shell
```

### Stop the Container

```bash
docker compose down
```

Or using the helper:
```bash
./payload.sh stop
```

### Restart the Container

```bash
docker compose restart
```

Or using the helper:
```bash
./payload.sh restart
```

### Rebuild the Container

If you make changes to dependencies or Dockerfile:

```bash
docker compose down
docker compose up -d --build
```

Or using the helper:
```bash
./payload.sh rebuild
```

## Volume Management

The following volumes are used:

- `payload_node_modules` - Persistent npm packages (built for container architecture)
- `payload_nuxt_cache` - Nuxt build cache
- `payload_output_cache` - Nuxt output cache
- `./data` - SQLite database and persistent data (mounted from host)

### View Volumes

```bash
docker volume ls | grep payload
```

### Reset Everything

```bash
docker compose down -v
docker compose up -d --build
docker exec payload-app pnpm rebuild better-sqlite3
```

Or using the helper:
```bash
./payload.sh clean
./payload.sh start
docker exec payload-app pnpm rebuild better-sqlite3
```

Note: This will delete all data including logs in the database.

## Testing the Setup

### 1. Verify the app is running

```bash
curl http://localhost:8911
```

You should see the HTML output of the app.

### 2. Send a test log

```bash
curl -X POST http://localhost:8911/api/log \
  -H 'Content-Type: application/json' \
  -d '{"message": "Test from Docker", "level": "INFO"}'
```

### 3. Run tests

```bash
./payload.sh test
```

### 4. Check for errors

```bash
./payload.sh check
```

## Production Deployment

For production, use the `Dockerfile.prod`:

```bash
# Build production image
docker build -f Dockerfile.prod -t payload-logs:prod .

# Run production container
docker run -d \
  --name payload-app-prod \
  -p 8911:3000 \
  -v ./data:/app/data \
  -e NODE_ENV=production \
  -e DATABASE_PATH=/app/data/logs.db \
  --restart unless-stopped \
  payload-logs:prod
```

Or use docker-compose-prod.yml (if created).

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in docker-compose.yml:

```yaml
ports:
  - "YOUR_PORT:3000"
```

### Permission Issues

If you encounter permission issues with mounted volumes:

```bash
docker exec payload-app sh -c "chown -R node:node /app"
```

### Better-sqlite3 Issues

If better-sqlite3 doesn't work, rebuild it:

```bash
docker exec payload-app pnpm rebuild better-sqlite3
```

This is needed because better-sqlite3 is a native module that must be compiled for the container's architecture (Linux Alpine).

### Tests Failing

Make sure the dev server is not running when executing tests:

```bash
docker exec payload-app pkill -f 'nuxt dev'
./payload.sh test
```

### Container Won't Start

Check logs:
```bash
docker logs payload-app
```

Remove and rebuild:
```bash
docker compose down -v
docker compose up -d --build
```

### Database Locked

If you get "database locked" errors, stop all processes accessing the database:

```bash
docker compose restart
```

### Out of Disk Space

Clean up unused Docker resources:

```bash
docker system prune -a --volumes
```

## Development Workflow

### Typical workflow

1. Start the container:
   ```bash
   docker compose up -d
   ```

2. Rebuild better-sqlite3 (first time only):
   ```bash
   docker exec payload-app pnpm rebuild better-sqlite3
   ```

3. Start dev server:
   ```bash
   ./payload.sh dev
   ```

4. Make code changes (they will hot-reload automatically)

5. Run tests:
   ```bash
   ./payload.sh test
   ```

6. Check for errors:
   ```bash
   ./payload.sh check
   ```

7. Stop dev server (Ctrl+C) and container when done:
   ```bash
   docker compose down
   ```

### Hot Reloading

Code changes are automatically detected and hot-reloaded because:
- Your source code is mounted as a volume (`.:/app`)
- The dev server watches for file changes
- Nuxt's HMR (Hot Module Replacement) is enabled

### Adding Dependencies

When you add new dependencies:

```bash
# Option 1: From host (if you have pnpm)
pnpm add <package>
docker compose restart

# Option 2: Inside container
docker exec -it payload-app pnpm add <package>
docker compose restart
```

For native modules, rebuild them:
```bash
docker exec payload-app pnpm rebuild <package>
```

## Architecture

The containerized setup ensures:

- ✅ All code runs in consistent environment (Node 20 Alpine)
- ✅ No "works on my machine" issues
- ✅ All dependencies (including native modules) are compiled for Linux/Alpine
- ✅ Playwright browsers are pre-installed (Chromium for testing)
- ✅ WebSocket support is fully functional
- ✅ Tests run in headless mode with Chromium
- ✅ Hot reloading works via volume mounts
- ✅ Database persists across container restarts
- ✅ Separate volumes for node_modules, cache, and data
- ✅ Production-ready with Dockerfile.prod

## Files Overview

- `Dockerfile` - Development/testing image with all dependencies
- `Dockerfile.prod` - Production-optimized image
- `docker-compose.yml` - Development container configuration
- `.dockerignore` - Files excluded from Docker build
- `payload.sh` - Helper script for common commands
- `DOCKER.md` - This documentation

## Best Practices

1. **Always use the container for development** - Ensures consistency
2. **Rebuild better-sqlite3 after first start** - Native module compatibility
3. **Use named volumes** - Prevents conflicts between host and container
4. **Stop dev server before running tests** - Avoids port conflicts
5. **Use the helper script** - Simplifies command execution
6. **Commit data/ to .gitignore** - Keep database files local
7. **Use Dockerfile.prod for deployment** - Optimized for production

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nuxt Docker Deployment](https://nuxt.com/docs/getting-started/deployment#docker)
- [Playwright in Docker](https://playwright.dev/docs/docker)

