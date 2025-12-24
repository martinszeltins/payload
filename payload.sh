#!/bin/bash

# Payload Logs - Docker Helper Script
# This script makes it easier to run commands in the Docker container

CONTAINER_NAME="payload-app"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if container is running
check_container() {
    if ! docker ps | grep -q $CONTAINER_NAME; then
        echo -e "${RED}Error: Container '$CONTAINER_NAME' is not running.${NC}"
        echo -e "${YELLOW}Start it with: docker compose up -d${NC}"
        exit 1
    fi
}

# Display usage
usage() {
    echo "Payload Logs - Docker Helper"
    echo ""
    echo "Usage: ./payload.sh <command>"
    echo ""
    echo "Commands:"
    echo "  dev              Start development server"
    echo "  test             Run tests"
    echo "  test:ui          Run tests with UI"
    echo "  test:headed      Run tests in headed mode"
    echo "  check            Run typecheck + lint + tests"
    echo "  lint             Run ESLint"
    echo "  typecheck        Run TypeScript type checking"
    echo "  build            Build for production"
    echo "  preview          Preview production build"
    echo "  shell            Access container shell"
    echo "  logs             View container logs"
    echo "  restart          Restart container"
    echo "  rebuild          Rebuild and restart container"
    echo "  stop             Stop container"
    echo "  start            Start container"
    echo "  clean            Stop and remove everything (including volumes)"
    echo ""
    echo "Examples:"
    echo "  ./payload.sh dev"
    echo "  ./payload.sh test"
    echo "  ./payload.sh check"
}

# Main script
case "$1" in
    dev)
        check_container
        echo -e "${GREEN}Starting development server...${NC}"
        docker exec -it $CONTAINER_NAME pnpm dev --host
        ;;
    test)
        check_container
        echo -e "${GREEN}Running tests...${NC}"
        docker exec -it $CONTAINER_NAME pnpm test
        ;;
    test:ui)
        check_container
        echo -e "${GREEN}Running tests with UI...${NC}"
        docker exec -it $CONTAINER_NAME pnpm test:ui
        ;;
    test:headed)
        check_container
        echo -e "${GREEN}Running tests in headed mode...${NC}"
        docker exec -it $CONTAINER_NAME pnpm test:headed
        ;;
    check|check-errors)
        check_container
        echo -e "${GREEN}Running checks (typecheck + lint + tests)...${NC}"
        docker exec -it $CONTAINER_NAME pnpm check-errors
        ;;
    lint)
        check_container
        echo -e "${GREEN}Running ESLint...${NC}"
        docker exec -it $CONTAINER_NAME pnpm lint
        ;;
    typecheck)
        check_container
        echo -e "${GREEN}Running TypeScript type checking...${NC}"
        docker exec -it $CONTAINER_NAME pnpm typecheck
        ;;
    build)
        check_container
        echo -e "${GREEN}Building for production...${NC}"
        docker exec -it $CONTAINER_NAME pnpm build
        ;;
    preview)
        check_container
        echo -e "${GREEN}Starting production preview...${NC}"
        docker exec -it $CONTAINER_NAME pnpm preview
        ;;
    shell|sh)
        check_container
        echo -e "${GREEN}Accessing container shell...${NC}"
        docker exec -it $CONTAINER_NAME sh
        ;;
    logs)
        echo -e "${GREEN}Viewing container logs...${NC}"
        docker logs -f $CONTAINER_NAME
        ;;
    restart)
        echo -e "${YELLOW}Restarting container...${NC}"
        docker compose restart
        echo -e "${GREEN}Container restarted!${NC}"
        ;;
    rebuild)
        echo -e "${YELLOW}Rebuilding and restarting container...${NC}"
        docker compose down
        docker compose up -d --build
        echo -e "${GREEN}Container rebuilt and started!${NC}"
        ;;
    stop)
        echo -e "${YELLOW}Stopping container...${NC}"
        docker compose down
        echo -e "${GREEN}Container stopped!${NC}"
        ;;
    start)
        echo -e "${GREEN}Starting container...${NC}"
        docker compose up -d
        echo -e "${GREEN}Container started!${NC}"
        ;;
    clean)
        echo -e "${RED}⚠️  Warning: This will remove all volumes including the database!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}Cleaning up...${NC}"
            docker compose down -v
            echo -e "${GREEN}Everything cleaned!${NC}"
        else
            echo -e "${YELLOW}Cancelled.${NC}"
        fi
        ;;
    help|--help|-h|"")
        usage
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        usage
        exit 1
        ;;
esac
