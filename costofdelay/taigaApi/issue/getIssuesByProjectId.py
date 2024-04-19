import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


# Function to retrieve issues based on project id
def get_issues_by_project_id(project_id, auth_token):
    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for collecting the issues for project.
    issue_api_url = f"{taiga_url}/issues?project={project_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:
        # Make a GET request to Taiga API
        response = requests.get(issue_api_url, headers=headers)
        response.raise_for_status()

        # Extract and return the issue response list from the response
        issue_info = response.json()
        return issue_info

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching issues by project id: {e}")
        return None
