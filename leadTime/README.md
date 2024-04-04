# Lead Time Microservice

This microservice is responsible for calculating the lead time of a task in a project. The lead time is the time it takes for a task to go from the "In Progress" state to the "Deployed/Delivered" state.

## Setup (using docker)

1.  Make sure you are in the leadtime directory. This should have the Dockerfile file.

2.  Build the docker container

        bash
        docker build -t leadtime .

3.  Run the Docker Container

        bash
        docker run -p 5003:5003 leadtime

4.  Accessing the applications

        * The Flask backend APIs will be accessible at http://127.0.0.1:5003.

## Endpoints

### GET /

This endpoint returns the status of the microservice in the following format:

json
{
"message": "Lead Time micro-service is up and running!"
}

### POST /leadTime

This endpoint receives a JSON object with the following structure:

json
{
"project_id": "project_id",
}

and

Auth: Bearer Token

It returns the lead time of the project in the following format:

json
{
"plotData": [
{
"finished_date": "Sun, 11 Feb 2024 22:27:40 GMT",
"lead_time": 10,
"refId": 36,
"task": {
"created_date": "2024-02-01T02:38:23.165Z",
"finished_date": "2024-02-11T22:27:40.305Z",
"id": 5331049,
"ref": 36,
"subject": "Initialize a React Application"
}
},
]
}

### POST /leadTimeByRange

This endpoint receives a JSON object with the following structure:

json
{
"project_id": "project_id",
}

and

Auth: Bearer Token

It returns the lead time of each task in the project in the following format:

json
{
"plotData": [
{
"finished_date": "Sun, 11 Feb 2024 22:27:40 GMT",
"lead_time": 10,
"refId": 36,
"task": {
"created_date": "2024-02-01T02:38:23.165Z",
"finished_date": "2024-02-11T22:27:40.305Z",
"id": 5331049,
"ref": 36,
"subject": "Initialize a React Application"
}
},
]
}
