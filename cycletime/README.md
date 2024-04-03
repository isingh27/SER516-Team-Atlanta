# Cycle Time Microservice

This microservice is responsible for calculating the cycle time of a task in a project. The cycle time is the time it takes for a task to go from the "In Progress" state to the "Done" state.

## Setup (using docker)

1. Make sure you are in the `cycletime` directory. This should have the `Dockerfile` file.

2. Build the docker container
    
        ```bash
        docker build -t cycletime .
        ```
3. Run the Docker Container

        ```bash
        docker run -p 5002:5002 cycletime
        ```
4. Accessing the applications
    
        * The Flask backend APIs will be accessible at http://127.0.0.1:5002.


## Endpoints

### GET /

This endpoint returns the status of the microservice in the following format:

```json
{
    "message": "CycleTime Microservice is up and running!"
}
```

### POST /cycleTime

This endpoint receives a JSON object with the following structure:

```json
{
    "project_id": "project_id",
}
```
and 

Auth: Bearer Token

It returns the cycle time of the project in the following format:

```json
{
    "cycle_time": "cycle_time"
}
```

### POST /cycleTimesPerUserStory

This endpoint receives a JSON object with the following structure:

```json
{
    "project_id": "project_id",
}
```

and

Auth: Bearer Token

It returns the cycle time of each task in the project in the following format:

```json
{
    "data": [
        {
            "cycle_time": 43,
            "end_date": "Wed, 13 Mar 2024 20:31:26 GMT",
            "refId": 5,
            "start_date": "Mon, 29 Jan 2024 21:24:00 GMT"
        },
    ],
    "status": "success"
}
```

### POST /cycleTimesPerTask

This endpoint receives a JSON object with the following structure:

```json
{
    "project_id": "project_id",
}
```

and

Auth: Bearer Token

It returns the cycle time of each task in the project in the following format:

```json
{
    "data": [
        {
            "cycle_time": 43,
            "end_date": "Wed, 13 Mar 2024 20:31:26 GMT",
            "refId": 5,
            "start_date": "Mon, 29 Jan 2024 21:24:00 GMT"
        },
    ],
    "status": "success"
}
```