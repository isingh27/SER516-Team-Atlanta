import os
import requests
from datetime import datetime
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class UserStoryFetchingError(Exception):
    def __init__(self, status_code, reason):
        self.status_code = status_code
        self.reason = reason

def get_user_story(project_id, auth_token):

    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the user stories API endpoint for the specified project
    user_story_api_url = f"{taiga_url}/userstories?project={project_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }

    try:

        # Make a GET request to Taiga API to retrieve user stories
        response = requests.get(user_story_api_url, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)

        if response.status_code == 401:
            raise UserStoryFetchingError(401, "Client Error: Unauthorized")

        # Extract and return the user stories information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching UserStory: {e}")
        raise UserStoryFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching UserStory: {e}")
        raise UserStoryFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching UserStory:")
        raise 



def get_custom_attribute_from_userstory(user_story_id, auth_token):

    taiga_url = os.getenv('TAIGA_URL')

    custom_attribute_api_url = f"{taiga_url}/userstories/custom-attributes-values/{user_story_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:

        response = requests.get(custom_attribute_api_url, headers=headers)
        response.raise_for_status() 
        
        if response.status_code == 401:
            raise UserStoryFetchingError(401, "Client Error: Unauthorized")

        custom_attribute = response.json()
        custom_attribute_data = custom_attribute['attributes_values']

        return custom_attribute_data

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching UserStory: {e}")
        raise UserStoryFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching UserStory: {e}")
        raise UserStoryFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching UserStory:")
        raise 
    
def get_custom_attribute_type_id(project_id, auth_token, attribute_name):

    taiga_url = os.getenv('TAIGA_URL')

    custom_attribute_api_url = f"{taiga_url}/userstory-custom-attributes?project={project_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:

        response = requests.get(custom_attribute_api_url, headers=headers)
        response.raise_for_status() 

        if response.status_code == 401:
            raise UserStoryFetchingError(401, "Client Error: Unauthorized")

        for res in response.json():
            if res["name"] == attribute_name:
                return str(res["id"])

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching UserStory: {e}")
        raise UserStoryFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching UserStory: {e}")
        raise UserStoryFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching UserStory:")
        raise 

def get_userstories_by_sprint(sprint_id, auth_token):
    taiga_url = os.getenv('TAIGA_URL')

    userstory_api_url = f"{taiga_url}/userstories?milestone={sprint_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }
    try:

        # Make a GET request to Taiga API to retrieve user stories
        response = requests.get(userstory_api_url, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)

        # Extract and return the user stories information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching UserStory: {e}")
        raise UserStoryFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching UserStory: {e}")
        raise UserStoryFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching UserStory:")
        raise 
    

