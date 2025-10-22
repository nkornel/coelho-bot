#!/bin/bash

# Exit on any error
set -e

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
USERNAME="nkornel"  # Change this to your Docker Hub username
IMAGE_NAME="discord-coelho-bot"

# Build the image
echo "🔨 Building Docker image..."
docker build -t $USERNAME/$IMAGE_NAME:latest -t $USERNAME/$IMAGE_NAME:$VERSION .

# Push the images
echo "⬆️ Pushing to Docker Hub..."
docker push $USERNAME/$IMAGE_NAME:latest
docker push $USERNAME/$IMAGE_NAME:$VERSION

echo "✅ Done! Image pushed as $USERNAME/$IMAGE_NAME:latest and $USERNAME/$IMAGE_NAME:$VERSION"