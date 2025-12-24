# Testing Documentation

## E2E Testing with Playwright

This project uses Playwright for end-to-end testing. The test suite covers the main functionality of the application.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in UI mode (interactive)
pnpm test:ui

# Run tests in headed mode (see browser)
pnpm test:headed

# View last test report
pnpm exec playwright show-report
```

### Test Coverage

The E2E test suite includes the following test files:

#### Dashboard Tests (`tests/e2e/dashboard.spec.ts`)
- Page load verification
- Filter controls visibility
- Sidebar navigation elements

#### Log Management Tests (`tests/e2e/logs.spec.ts`)
- Creating logs via UI
- Filtering logs by level
- ESC key to close create form

#### API Endpoint Tests (`tests/e2e/api.spec.ts`)
- Creating logs via API
- Fetching logs with pagination
- Rate limiting validation
- Input validation

#### API Keys Management (`tests/e2e/api-keys.spec.ts`)
- Opening API keys modal
- Creating new API keys
- Deleting API keys
- ESC key to close modal

#### IP Whitelist Management (`tests/e2e/ip-whitelist.spec.ts`)
- Opening IP whitelist modal
- Adding new IP addresses
- Validating IP address format
- Deleting IP addresses
- ESC key to close modal

#### Code Snippets Modal (`tests/e2e/code-snippets.spec.ts`)
- Opening code snippets modal
- Displaying cURL, JavaScript, and PHP snippets
- Copying snippets to clipboard
- ESC key and button to close modal

#### Pagination (`tests/e2e/pagination.spec.ts`)
- Showing pagination controls
- Navigating to next/previous pages
- Displaying correct page information

### Skipped Tests

Some tests are marked as skipped because they depend on timing and can be flaky in CI environments:

- `tests/e2e/logs.spec.ts` - "should filter logs by search term"
  - Reason: Depends on debounce timing and search indexing
  
- `tests/e2e/websocket.spec.ts` - "should receive new logs via WebSocket"
  - Reason: Depends on WebSocket connection timing and pagination state

These tests work locally but may fail in CI due to timing variations. They can be run individually if needed.

### Test Configuration

Tests are configured in `playwright.config.ts`:

- **Base URL**: http://localhost:3000
- **Test directory**: ./tests/e2e
- **Browser**: Chromium (can be extended to Firefox and Webkit)
- **Reporter**: HTML reporter (generates detailed test reports)
- **Web Server**: Automatically starts dev server before running tests

### Writing New Tests

When writing new tests:

1. Use `data-testid` attributes for stable selectors
2. Use `waitForLoadState('networkidle')` to wait for page to fully load
3. Use role-based selectors when possible (e.g., `getByRole`, `getByText`)
4. Add timeouts for async operations
5. Use `.first()` or `.nth()` when multiple elements match
6. Clean up test data to avoid test pollution

### Debugging Tests

```bash
# Run specific test file
pnpm test tests/e2e/dashboard.spec.ts

# Run specific test
pnpm test -g "should load the dashboard page"

# Debug with UI mode
pnpm test:ui

# Run in headed mode to see browser
pnpm test:headed
```

### CI Integration

Tests can be integrated into CI/CD pipelines:

```bash
# Run tests in CI mode
npx playwright test --reporter=github

# Generate and upload HTML report
npx playwright show-report
```

## Code Quality

The project uses ESLint and TypeScript for code quality:

```bash
# Check types
pnpm run typecheck

# Run linter
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Run all checks (typecheck + lint + tests)
pnpm run check-errors
```

The `check-errors` script runs all quality checks in sequence:
1. TypeScript type checking
2. ESLint linting
3. Playwright E2E tests

All code should pass type checking, linting, and tests before committing.
