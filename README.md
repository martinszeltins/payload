# Payload - Log Server

A beautiful, real-time logging server that allows you to send logs from any application to a remote server for storage and analysis.

## Features

- 🎨 Beautiful dark-themed UI with elegant design
- 📊 Real-time log monitoring with auto-refresh
- 🔍 Advanced filtering by log level, date range, and keywords
- 🔐 Secure access via API keys or IP whitelist
- 🚦 Rate limiting to prevent abuse
- 📋 Copy logs to clipboard with one click
- 💻 Code snippets for multiple languages (cURL, JavaScript, PHP, Python)
- 🎯 JSON syntax highlighting
- ⏱️ Automatic deletion of logs older than 24 hours
- 📄 Pagination for large datasets
- 🌐 CORS support for cross-origin requests

## Technology Stack

- **Nuxt 4** - Full-stack framework (backend and frontend)
- **TypeScript** - Type safety
- **SQLite** - Lightweight database with better-sqlite3
- **Tailwind CSS 4** - Styling
- **VueUse** - Vue composition utilities
- **Docker** - Containerization

## Quick Start

### Using Docker (Recommended)

1. Clone the repository
2. Run with Docker Compose:

```bash
docker-compose up -d
```

3. Open your browser at `http://localhost:3000`

### Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open your browser at `http://localhost:3000`

## Sending Logs

### Using cURL

```bash
curl -X POST http://localhost:3000/api/log \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "message": "Test log message",
    "level": "INFO",
    "metadata": "{\"user_id\": 123}"
  }'
```

### Using JavaScript

```javascript
fetch('http://localhost:3000/api/log', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'YOUR_API_KEY'
    },
    body: JSON.stringify({
        message: 'Test log message',
        level: 'INFO'
    })
})
```

### Log Levels

- `DEBUG` - Detailed debug information
- `INFO` - Informational messages
- `WARN` - Warning messages
- `ERROR` - Error messages
- `FATAL` - Critical errors

## API Keys and IP Whitelist

The application supports two authentication methods:

1. **API Keys**: Generate API keys from the UI and use them in the `X-API-Key` header
2. **IP Whitelist**: Add trusted IP addresses that can send logs without an API key

Access these settings from the sidebar in the web interface.

## Configuration

### Environment Variables

- `DATABASE_PATH` - Path to SQLite database file (default: `./data/logs.db`)
- `NODE_ENV` - Environment mode (`development` or `production`)

## Development

### Project Structure

```
app/
  ├── assets/         # CSS and static assets
  ├── components/     # Vue components
  ├── layouts/        # Layout components
  └── pages/          # Page components
server/
  ├── api/            # API endpoints
  ├── database/       # Database utilities
  ├── middleware/     # Server middleware
  ├── plugins/        # Server plugins
  └── utils/          # Utility functions
```

### Building for Production

```bash
pnpm build
```

### Running Tests

```bash
pnpm test
```

### Linting

```bash
pnpm lint
```

## Security

- Rate limiting: 100 requests per minute per IP
- Input sanitization
- API key authentication
- IP whitelist support
- CORS headers properly configured

## License

MIT
