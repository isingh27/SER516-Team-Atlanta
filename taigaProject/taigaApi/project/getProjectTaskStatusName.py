import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


# Function to retrieve project task statuses for a specific project from the Taiga API
def get_project_task_status_name(project_id, auth_token):
    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the project task statuses API endpoint for the specified project
    project_task_api_url = f"{taiga_url}/task-statuses?project={project_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:
        # Make a GET request to Taiga API to retrieve project task statuses
        response = requests.get(project_task_api_url, headers=headers)
        response.raise_for_status()

        # Extract and return the project task statuses information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching project by slug: {e}")
        return None
