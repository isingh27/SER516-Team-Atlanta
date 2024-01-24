# SER516-Team-Louisville

# Taiga API Integration

This project is a Python script for interacting with the Taiga API to perform various task and calculating metrics.

## Prerequisites

Before running the script, make sure you have the following installed:

- Python 3
- Required Python packages (install using `pip install -r requirements.txt`)
- Taiga account with API access
- Taiga project slug

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ser516asu/SER516-Team-Miami.git
   cd SER516-Team-Miami
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a .env file in the project root and add the following:

   ```bash
   TAIGA_URL=https://api.taiga.io/api/v1
   ```

4. Run the script:

   ```bash
   python3 app.py
   ```

## Getting Taiga Project Slug

To interact with the Taiga API using the provided Python script, you will need the project slug of your Taiga project. Follow these steps to find the project slug:

1. **Login to Taiga**: Open your web browser and log in to your Taiga account.

2. **Select the Project**: Navigate to the project for which you want to obtain the project slug.

3. **Project URL**: Look at the URL in your browser's address bar while you are inside the project. The project slug is the part of the URL that comes after the last slash ("/"). For example:
