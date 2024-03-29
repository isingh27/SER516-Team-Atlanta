import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


# Function to retrieve tasks for a specific project from the Taiga API
def get_tasks(project_id, auth_token):

    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the tasks API endpoint for the specified project
    task_api_url = f"{taiga_url}/tasks?project={project_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    try:

        # Make a GET request to Taiga API to retrieve tasks
        response = requests.get(task_api_url, headers=headers)
        response.raise_for_status()  # Raise an exception for
        # HTTP errors (4xx or 5xx)

        # Extract and return the tasks information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.RequestException as e:

        # Handle errors during the API request and print an error message
        print(f"Error fetching tasks: {e}")
        return None


# Function to retrieve closed tasks for a specific project from the Taiga API
def get_closed_tasks(project_id, auth_token):

    # Call the get_tasks function to retrieve all tasks for the project
    tasks = get_tasks(project_id, auth_token)
    if tasks:

        # Filter tasks to include only closed tasks and format the result
        closed_tasks = [
            {
                "id": task["id"],
                "subject": task["subject"],
                "created_date": task["created_date"],
                "finished_date": task["finished_date"],
                "ref": task["ref"]
            }
            for task in tasks if task.get("is_closed")
        ]

        return closed_tasks
    else:
        return None


# Function to retrieve user stories for a specific project from the Taiga API
def get_user_stories(project_id, auth_token):

    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the user stories API endpoint
    # for the specified project
    user_story_api_url = f"{taiga_url}/userstories?project={project_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    try:

        # Make a GET request to Taiga API to retrieve user stories
        response = requests.get(user_story_api_url, headers=headers)
        response.raise_for_status()  # Raise an exception for
        # HTTP errors (4xx or 5xx)

        # Extract and return the user stories information from the response
        user_stories = response.json()
        return user_stories

    except requests.exceptions.RequestException as e:

        # Handle errors during the API request and print an error message
        print(f"Error fetching user stories: {e}")
        return None


# Function to retrieve closed user stories
    # for a specific project from the Taiga API
def get_closed_user_stories(project_id, auth_token):

    # Call the get_user_story function to retrieve all user
    # stories for the project
    user_stories = get_user_stories(project_id, auth_token)
    if user_stories:

        # Filter user stories to include only closed user
        # stories and format the result
        closed_user_stories = [
            {
                "id": story["id"],
                "subject": story["subject"],
                "created_date": story["created_date"],
                "finish_date": story["finish_date"],
                "ref": story["ref"]
            }
            for story in user_stories if story.get("is_closed")
        ]

        return closed_user_stories
    else:
        return None

# Function to retrieve all tasks for a specific project from the Taiga API


def get_all_tasks(project_id, auth_token):

    # Call the get_tasks function to retrieve all tasks for the project
    tasks = get_tasks(project_id, auth_token)
    if tasks:

        # Format all tasks and return the result
        all_tasks = [
            {
                "id": task["id"],
                "created_date": task["created_date"],
                "finished_date": task["finished_date"]
            }
            for task in tasks
        ]

        return all_tasks
    else:
        return None
