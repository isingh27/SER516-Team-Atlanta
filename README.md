# SER516-Team-Atlanta

# Description
  
WebApp built using React that uses Flask as backend for interacting with the Taiga API to perform various task and calculating metrics.

![Netlify Status](https://api.netlify.com/api/v1/badges/bab3a11e-263b-4e5e-bf02-2bd272aeac3e/deploy-status)

Live Preview: [Here](https://team-atlanta.netlify.app)

## Prerequisites

Before running the script, make sure you have the following installed:

- Python v3.11
- NodeJS v20.11
- Taiga account with API access
- Taiga project slug

## Various setup Methods
- [Setup using docker](#setup-using-docker) (Recommended)
- [Setup using shell script](#setup-using-shell-script)



## Setup (using docker)

#### Prerequisites

Before spinning up the docker containers, make sure you have the following installed:

- Docker
- Docker Compose

1. Make sure you are in the root of the project directory. This should have the `docker-compose.yml` file.

2. Build and Run the Docker Containers
	
	```bash
	docker-compose up --build
	```

3. Accesing the applications
* The React frontend app will be accessible at http://localhost:3000.
* The API Gateway backend API will be accessible at http://localhost:5000/.

## Setup (using shell script)

1. Make the script executable
```bash
chmod +x setup.sh
```
2. Run the script (you'll be asked to enter your system's logged in user's  password)
```bash 
./setup.sh
```

3. Open http://localhost:3000 to view the login page in your browser.

### Shutting Down the Servers

When you're finished with using the application and wish to shut down the servers, follow these steps:

#### Stopping the Flask API Server

On macOS, you can find and terminate the Flask server process using the following commands:

1. Find the process ID (PID) listening on port 5001 (used by the Flask server):

    ```bash
    lsof -i -P -n | grep :5001
    ```

    This command lists all processes using port 5001. Look for the PID in the output.

2. Kill the process using its PID:

    ```bash
    kill <PID>
    ```

    Replace `<PID>` with the actual process ID you found.

#### Stopping the React App

Since the React app is managed by PM2, stopping it requires a PM2 command:

1. To stop the React app run by PM2, execute:

    ```bash
    pm2 stop ui
    ```

    This command tells PM2 to stop managing the React app named "ui". 

These steps ensure both the React and Flask servers are properly shut down.



## Getting Taiga Project Slug

To interact with the Taiga API using the provided Python script, you will need the project slug of your Taiga project. Follow these steps to find the project slug:

1. **Login to Taiga**: Open your web browser and log in to your Taiga account.

2. **Select the Project**: Navigate to the project for which you want to obtain the project slug.

3. **Project URL**: Look at the URL in your browser's address bar while you are inside the project. The project slug is the part of the URL that comes after the last slash ("/"). For example: **ser516asu-ser516-team-atlanta**
