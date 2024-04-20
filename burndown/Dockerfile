# Use an official Python runtime as a parent image
FROM python:3.11

# Install Redis
RUN apt-get update && apt-get install -y redis-server

# Set the working directory in the container
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . /app
# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
# Make port 5007 available to the world outside this container
EXPOSE 5007
# Define environment variable
ENV FLASK_APP=server.py
# Run Redis server and Flask application
CMD redis-server --daemonize yes && flask run --host=0.0.0.0 --port=5007
