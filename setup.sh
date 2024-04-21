#!/bin/bash

# Ensuring we exit on any error
set -e

touch .env & 
cat .env.example > .env

# Run Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up --build
