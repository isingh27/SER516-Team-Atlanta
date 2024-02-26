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
        'x-disable-pagination': 'True'

    }

    try:
        # Make a GET request to Taiga API to
        # retrieve project information by slug
        response = requests.get(project_api_url, headers=headers)
        response.raise_for_status()

        # Extract and return the project information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching project by slug: {e}")
        return None
    
def get_project_by_user(auth_token):
    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    user_api_url = f"{taiga_url}/users/me"
    # Construct the URL for the project information API endpoint by slug
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
        
    }
    try:
        # Make a GET request to Taiga API to retrieve project information by slug
        response = requests.get(user_api_url, headers=headers)
        response.raise_for_status()

        # Extract and return the project information from the response
        user_info = response.json()
        project_api_url = f"{taiga_url}/projects?member={user_info['id']}&order_by=user_order&slight=true"
        responseProject = requests.get(project_api_url, headers=headers)
        responseProject.raise_for_status()
        project_info = responseProject.json()
        projectDetails = []
        for project in project_info:
            projectDetails.append({'id': project['id'], 'name': project['name'], 'slug': project['slug']})
        return projectDetails
    
    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching project by slug: {e}")
        return None
    