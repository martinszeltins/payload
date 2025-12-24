# Quick Start Guide

## 🚀 Running the Application

### Development Mode
```bash
pnpm install
pnpm dev
```

The application will be available at http://localhost:3000

### Production Mode with Docker
```bash
docker-compose up -d
```

## 📝 First Steps

1. **Access the Dashboard**
   - Open http://localhost:3000 in your browser
   - You'll see the log dashboard

2. **Create an API Key**
   - Click "API Keys" in the sidebar
   - Enter a name for your API key
   - Click "Create"
   - **Important**: Copy the generated key immediately - it won't be shown again

3. **Send Your First Log**
   ```bash
   curl -X POST http://localhost:3000/ \
     -H "Content-Type: application/json" \
     -H "X-API-Key: YOUR_API_KEY_HERE" \
     -d '{
       "message": "Hello from my application!",
       "level": "INFO"
     }'
   ```

4. **View Logs**
   - Return to the dashboard
   - Your log should appear in the list
   - Click to expand JSON or metadata
   - Use the filters to search and filter logs

## 🔐 Authentication Options

### Option 1: API Keys
- Generate API keys from the UI
- Use the `X-API-Key` header when sending logs
- Recommended for production use

### Option 2: IP Whitelist
- Add trusted IP addresses in the "IP Whitelist" section
- These IPs can send logs without an API key
- Useful for internal networks

## 📊 Log Levels

- `DEBUG` - Detailed debug information (gray)
- `INFO` - Informational messages (teal)
- `WARN` - Warning messages (yellow)
- `ERROR` - Error messages (pink)
- `FATAL` - Critical errors (red)

## 💻 Code Examples

Click "Code Snippets" in the sidebar to see examples for:
- cURL
- JavaScript (Fetch & Axios)
- PHP (cURL & file_get_contents)
- Python (Requests)

## 🔍 Features

- **Real-time Updates**: Dashboard auto-refreshes every 30 seconds
- **JSON Highlighting**: JSON logs are automatically formatted and syntax-highlighted
- **Copy to Clipboard**: Click the 📋 icon to copy any log entry
- **Filtering**: Filter by log level, date range, and keywords
- **Auto-Cleanup**: Logs older than 24 hours are automatically deleted

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database path (default: ./data/logs.db)
DATABASE_PATH=./data/logs.db

# Node environment
NODE_ENV=production
```

## 📦 Docker Deployment

The application includes Docker configuration for easy deployment:

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔧 Development

### Project Structure
```
server/
  ├── api/          # API endpoints
  ├── database/     # Database utilities
  ├── middleware/   # Server middleware
  ├── plugins/      # Server plugins
  └── utils/        # Utility functions

app/
  ├── components/   # Vue components
  ├── layouts/      # Layout components
  ├── pages/        # Page components
  └── assets/       # CSS and static assets
```

### Testing the API

Test log creation:
```bash
# INFO log
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_KEY" \
  -d '{"message": "Test INFO log", "level": "INFO"}'

# ERROR log with metadata
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_KEY" \
  -d '{
    "message": "Database connection failed",
    "level": "ERROR",
    "metadata": "{\"host\": \"localhost\", \"port\": 5432}"
  }'

# JSON message
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_KEY" \
  -d '{
    "message": "{\"user_id\": 123, \"action\": \"login\", \"status\": \"success\"}",
    "level": "INFO"
  }'
```

## 🚨 Troubleshooting

### Database errors
- Ensure the `data` directory exists
- Check file permissions
- Verify DATABASE_PATH is correct

### Port already in use
```bash
# Change port in nuxt.config.ts or use environment variable
PORT=3001 pnpm dev
```

### API key not working
- Verify the key is correct
- Check that the key exists in the database
- Try adding your IP to the whitelist instead

## 📚 API Reference

### POST /
Create a new log entry

**Headers:**
- `Content-Type: application/json`
- `X-API-Key: YOUR_API_KEY` (optional if IP is whitelisted)

**Body:**
```json
{
  "message": "Log message (required)",
  "level": "INFO|DEBUG|WARN|ERROR|FATAL (optional, default: INFO)",
  "metadata": "Additional metadata as string or JSON (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Log entry created successfully"
}
```

### GET /api/logs
Retrieve logs

**Query Parameters:**
- `limit` - Number of logs per page (default: 50)
- `offset` - Pagination offset
- `level` - Filter by log level
- `search` - Search in message and metadata
- `startDate` - Filter by start timestamp (Unix timestamp)
- `endDate` - Filter by end timestamp (Unix timestamp)

## 🎨 UI Features

- **Dark Theme**: Beautiful dark-themed UI based on the Monocle design
- **Responsive**: Works on desktop and mobile devices
- **Sidebar Navigation**: Easy access to settings and code snippets
- **Modal Dialogs**: Manage API keys and IP whitelist
- **Syntax Highlighting**: JSON is automatically formatted and colored
- **One-Click Copy**: Copy logs, API keys, and code snippets easily

## ⚡ Performance

- **Rate Limiting**: 100 requests per minute per IP
- **Auto-Cleanup**: Logs older than 24 hours are deleted automatically
- **SQLite WAL Mode**: Better concurrent read/write performance
- **Indexed Queries**: Fast filtering and searching

## 🔒 Security

- API key authentication
- IP whitelist support
- Input sanitization
- CORS headers properly configured
- Rate limiting to prevent abuse
- No sensitive data in logs by default
