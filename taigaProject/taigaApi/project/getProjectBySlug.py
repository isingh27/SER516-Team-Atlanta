import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


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

        # Extract and return the project information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching project by slug: {e}")
        return None
