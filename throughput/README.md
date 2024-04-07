# Throughput Microservice

This is a simple microservice that calculates the throughput of a system. The throughput is calculated as the number of requests processed per second.

## API Endpoints

The microservice has the following API endpoints:

1. `/throughput` - This endpoint calculates the throughput of the system. It takes the following parameters:
    * sprint_id: The ID of the sprint for which the throughput is to be calculated.
    * project_id: The ID of the project for which the throughput is to be calculated.
    
    * Method: POST
    The endpoint returns the throughput in requests per second.
    

## Setup (using docker)

1. Make sure you are in the `throughput` directory. This should have the `Dockerfile` file.

2. Build the docker container
    
        ```bash
        docker build -t throughput .
        ```
3. Run the Docker Container

        ```bash
        docker run -p 5004:5004 throughput
        ```
4. Accessing the applications
    
        * The Flask backend APIs will be accessible at http://127.0.0.1:5004.
