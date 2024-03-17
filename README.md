# SER516-Team-Atlanta

# Description
  
WebApp built using React that uses Flask as backend for interacting with the Taiga API to perform various task and calculating metrics.

[![Netlify Status](https://api.netlify.com/api/v1/badges/bab3a11e-263b-4e5e-bf02-2bd272aeac3e/deploy-status)]

Live Preview: [Here](https://team-atlanta.netlify.app)

## Prerequisites

Before running the script, make sure you have the following installed:

- Python v3.11
- NodeJS v20.11
- Taiga account with API access
- Taiga project slug

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/isingh27/SER516-Team-Atlanta.git
   cd SER516-Team-Atlanta
   ```

2. Install dependencies:

	a. NodeJS packages:
	```bash
	cd ui
	npm i
	```

	b. Python packages:
	Note:- Make sure you are in the root directory of the project

	```bash
	cd taigaProject
	pip install -r requirements.txt
	```

3. Create a .env file in the **taigaProject** directory and add the following:

   ```bash
   TAIGA_URL=https://api.taiga.io/api/v1
   ```

4. Running the project:-

	a. React

	```bash
	cd ui
	npm start
	```

	b. Flask Backend
	Note:- Make sure you are in the root directory of the project

	```bash
	cd taigaProject
	python3 server.py
	```

   c. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Getting Taiga Project Slug

To interact with the Taiga API using the provided Python script, you will need the project slug of your Taiga project. Follow these steps to find the project slug:

1. **Login to Taiga**: Open your web browser and log in to your Taiga account.

2. **Select the Project**: Navigate to the project for which you want to obtain the project slug.

3. **Project URL**: Look at the URL in your browser's address bar while you are inside the project. The project slug is the part of the URL that comes after the last slash ("/"). For example: **ser516asu-ser516-team-atlanta**
