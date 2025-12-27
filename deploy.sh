#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Configuration
IMAGE_NAME="payload-logs"
IMAGE_TAG="prod"
CONTAINER_NAME="payload-app-prod"
PORT="8911:3000"
DATA_PATH="$(pwd)/data"

# Stop development container if running (to free up port 8911)
if [ "$(docker ps -q -f name=payload-app)" ]; then
    echo "🛑 Stopping development container to free up port..."
    docker compose down || true
fi

# Build new image
echo ""
echo "📦 Building production image..."
docker build -f Dockerfile.prod -t $IMAGE_NAME:$IMAGE_TAG .

# Stop and remove old container if it exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo ""
    echo "🛑 Stopping old container..."
    docker stop $CONTAINER_NAME || true
    
    echo "🗑️  Removing old container..."
    docker rm $CONTAINER_NAME || true
fi

# Create data directory if it doesn't exist
mkdir -p $DATA_PATH

# Run new container
echo ""
echo "🎯 Starting new container..."
docker stop payload-app
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT \
  -v $DATA_PATH:/app/data \
  -e NODE_ENV=production \
  -e DATABASE_PATH=/app/data/logs.db \
  --restart unless-stopped \
  $IMAGE_NAME:$IMAGE_TAG

# Wait a moment for container to start
sleep 2

# Check if container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "📊 Container status:"
    docker ps -f name=$CONTAINER_NAME
    echo ""
    echo "📝 View logs: docker logs $CONTAINER_NAME -f"
    echo "🌐 App available at: http://localhost:8911"
else
    echo ""
    echo "❌ Deployment failed! Container is not running."
    echo "📝 Check logs: docker logs $CONTAINER_NAME"
    exit 1
fi
