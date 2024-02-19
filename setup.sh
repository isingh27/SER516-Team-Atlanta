#!/bin/bash

# Install NodeJS dependencies
cd ui
npm install

# Install Python dependencies
cd ../taigaProject
pip install -r requirements.txt

# # Create .env file
# echo "TAIGA_URL=https://api.taiga.io/api/v1" > .env

# Run React app
cd ../ui
npm start &

# Run Flask backend
cd ../taigaProject
python3 server.py &