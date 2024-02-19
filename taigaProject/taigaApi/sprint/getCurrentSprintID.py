import os
import requests
from dotenv import load_dotenv
import datetime

# Load environment variables from a .env file
load_dotenv()

def get_current_sprint_id(project_id, auth_token):

    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the project information API endpoint by sprint id
    project_api_url = f"{taiga_url}/milestones?project={project_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    try:
        # Make a GET request to Taiga API to retrieve milestone stats by sprint id
        response = requests.get(project_api_url, headers=headers)
        response.raise_for_status()

        # Extract the project information from the response
        project_info = response.json()

        # Get the current date
        current_date = datetime.date.today()

        # Iterate over the milestones (sprints) and find the current one
        for sprint in project_info:
            start_date = datetime.datetime.strptime(sprint['estimated_start'], '%Y-%m-%d').date()
            end_date = datetime.datetime.strptime(sprint['estimated_finish'], '%Y-%m-%d').date()

            if start_date <= current_date <= end_date:
                return sprint['id']

        print("No current sprint found.")
        return None

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching milestone stats: {e}")
        return None
