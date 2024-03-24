#!/bin/bash

# Ensuring we exit on any error
set -e

# Install NodeJS dependencies
echo "Installing NodeJS dependencies..."
cd ui
sudo npm install

# Install Python dependencies
echo "Installing Python dependencies..."
cd ../taigaProject
pip install -r requirements.txt

# echo "TAIGA_URL=https://api.taiga.io/api/v1" > .env

# Run React app using PM2
echo "Starting React app using PM2..."
cd ../ui

# Check if the app is already running, then restart it; otherwise, start a new one
pm2 describe ui > /dev/null 2>&1
if [ $? -eq 0 ]; then
  pm2 restart ui
else
  pm2 start npm --name "ui" -- start
fi

# Run Flask backend in the background
echo "Starting Flask backend..."
cd ../taigaProject
python3 server.py
