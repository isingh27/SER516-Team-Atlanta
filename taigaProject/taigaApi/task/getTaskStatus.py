import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

def get_task_status(sprint_id, auth_token):
    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the project information API endpoint by sprint id
    project_api_url = f"{taiga_url}/tasks?milestone={sprint_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    try:
        # Make a GET request to Taiga API to retrieve tasks by sprint id
        response = requests.get(project_api_url, headers=headers)
        response.raise_for_status()

        # Extract and return the task information from the response
        tasks = response.json()
        sprint_tasks = [{'id': task['id'], 'name': task['subject'], 'status': task['status_extra_info']['name'], 'sprint_id': sprint_id} for task in tasks]

        return sprint_tasks

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching task status: {e}")
        return None
