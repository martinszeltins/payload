# Online Logging App

This is an online logging app. Sometimes it is useful to be able to send logs to a remote server. This is exactly what this app does. It allows you to send logs from your application to a remote server for storage and analysis.

The idea is simple. Anyone, from anywhere, using any technology should be able to send logs to this server. Then the user should be able to open our beautiful web app and see the logs.

## Features

- Beautiful design. The design is found in design.html file. This should be used to implement the frontend design.
- Simple API interface. The API needs to be as simple as possible. For example:

```bash
curl -X POST https://log.mydomain.com/ -H "Content-Type: application/json" -d '{"message": "Test message from cURL"}'
```

- Users should be able to filter by date range, log level, and keywords.
- Support for different log levels (e.g., INFO, WARN, ERROR).
- Pagination.
- There should be 2 ways to send logs: 1) You are on IP whitelist or 2) You provide a valid API key.
- Rate limiting to prevent abuse.
- Logs should be stored in a database for easy retrieval and analysis.
- Logs should be formatted properly. If the user sends JSON, it should be outputted as JSON with correct indentation and syntax highlighting. If it is plain multi line text, it should be displayed as is with line breaks preserved.
- There should be buttons to copy CURL, JavaScript, PHP code snippets for sending logs to the server.
- The app should be secure. Make sure to sanitize inputs and protect against common web vulnerabilities.
- User should be able to copy individual log entries to clipboard with a single click.
- Log entries should be stored for a maximum of 24 hours, after which they should be automatically deleted. (Nitro tasks or cron can do this)
- The app should be responsive and work well on both desktop and mobile devices.
- There should be a way to add a new whitelisted IP address or remove an existing one from the UI directly.
- We do not need registration or login screens.
- Handle CORS properly to allow cross-origin requests. Anyone should be able to send logs from any domain.

# Technology Stack

The project should use the following technologies:

- Docker and Docker compose for containerization
- Nuxt 4 as a full-stack framework (backend and frontend)
- TypeScript for type safety
- SQLite as the database
- Tailwind CSS for styling
- VueUse, NuxtUI, Pinia and other Vue and Nuxt ecosystem libraries as needed
- ESLint with recommended rules for code quality, run it after implementing new features or making changes.

# Code Style

- Write clean, readable, maintainable code.
- Follow best practices for the chosen technologies.
- Write tests where applicable. Run tests after implementing new features or making changes. This is how we will know that we have not broken anything.
- No semicolons in the code.
- Use consistent indentation (4 spaces).
- Always add a blank line and comments to logical HTML blocks. This makes it much easier and faster to navigate a larger HTML file by adding comments to separate logical blocks. We don't want HTML to be a big wall of text. Use new line breaks between sections.
- Do not leave zombie code or commented code in the codebase. Remove it. ESlint should catch unused variables.

The UI needs to be implemented based on the design found in design.html file. Make sure to follow the design closely.
