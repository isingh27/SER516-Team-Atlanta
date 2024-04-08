#!/bin/bash

# Ensuring we exit on any error
set -e

# Run Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up -d
