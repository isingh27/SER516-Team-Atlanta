import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class ProjectFetchingError(Exception):
    def __init__(self, status_code, reason):
        self.status_code = status_code
        self.reason = reason

# Function to retrieve project information by slug from the Taiga API
def get_project_by_slug(project_slug, auth_token):
    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the project information API endpoint by slug
    project_api_url = f"{taiga_url}/projects/by_slug?slug={project_slug}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:
        # Make a GET request to Taiga API to retrieve project information by slug
        response = requests.get(project_api_url, headers=headers)
        response.raise_for_status()

        if response.status_code == 401:
            raise ProjectFetchingError(401, "Client Error: Unauthorized")


        # Extract and return the project information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching Project: {e}")
        raise ProjectFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching Project: {e}")
        raise   ProjectFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print(f"Unexpected error fetching Project:{e}")
        raise 
