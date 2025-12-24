#!/bin/bash

# Payload Logs - Docker Setup Verification Script
# This script verifies that the Docker containerization is working correctly

echo "==========================================="
echo "Payload Logs - Docker Verification"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check if Docker is installed
echo -n "1. Checking Docker installation... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Docker is not installed!"
    ERRORS=$((ERRORS + 1))
fi

# Check if Docker Compose is installed
echo -n "2. Checking Docker Compose installation... "
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Docker Compose is not installed!"
    ERRORS=$((ERRORS + 1))
fi

# Check if container is running
echo -n "3. Checking if payload-app container is running... "
if docker ps | grep -q payload-app; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Container is not running. Start with: docker compose up -d"
    ERRORS=$((ERRORS + 1))
fi

# Check volumes
echo -n "4. Checking Docker volumes... "
VOL_COUNT=$(docker volume ls --filter name=payload | grep payload | wc -l)
if [ "$VOL_COUNT" -ge 3 ]; then
    echo -e "${GREEN}✓ ($VOL_COUNT volumes)${NC}"
else
    echo -e "${YELLOW}⚠ Only $VOL_COUNT volumes found${NC}"
fi

# Check if port 8911 is accessible
echo -n "5. Checking if app is accessible on port 8911... "
if curl -s http://localhost:8911 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   App is not accessible at http://localhost:8911"
    ERRORS=$((ERRORS + 1))
fi

# Check if better-sqlite3 is working
echo -n "6. Checking better-sqlite3 (native module)... "
TEST_OUTPUT=$(docker exec payload-app sh -c "node -e \"try { require('better-sqlite3'); console.log('OK'); } catch(e) { console.log('ERROR'); }\"" 2>&1)
if echo "$TEST_OUTPUT" | grep -q "OK"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ May need rebuild${NC}"
    echo "   Run: docker exec payload-app pnpm rebuild better-sqlite3"
fi

# Check if pnpm is available in container
echo -n "7. Checking pnpm in container... "
if docker exec payload-app which pnpm > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   pnpm is not available in container!"
    ERRORS=$((ERRORS + 1))
fi

# Check if Playwright is installed
echo -n "8. Checking Playwright installation... "
PW_VERSION=$(docker exec payload-app sh -c "pnpm exec playwright --version 2>/dev/null")
if [ ! -z "$PW_VERSION" ]; then
    echo -e "${GREEN}✓ ($PW_VERSION)${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Playwright is not installed!"
    ERRORS=$((ERRORS + 1))
fi

# Check helper script
echo -n "9. Checking helper script (payload.sh)... "
if [ -f "./payload.sh" ] && [ -x "./payload.sh" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    if [ -f "./payload.sh" ]; then
        echo "   Script exists but is not executable. Run: chmod +x payload.sh"
    else
        echo "   Script not found!"
    fi
fi

# Check documentation
echo -n "10. Checking documentation (DOCKER.md)... "
if [ -f "./DOCKER.md" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "   DOCKER.md not found!"
fi

echo ""
echo "==========================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "You can now use the following commands:"
    echo "  ./payload.sh dev      - Start development server"
    echo "  ./payload.sh test     - Run tests"
    echo "  ./payload.sh check    - Run all checks"
    echo "  ./payload.sh --help   - See all commands"
    echo ""
    echo "The app is running at: http://localhost:8911"
else
    echo -e "${RED}✗ $ERRORS error(s) found!${NC}"
    echo ""
    echo "Please fix the errors above before continuing."
    exit 1
fi
