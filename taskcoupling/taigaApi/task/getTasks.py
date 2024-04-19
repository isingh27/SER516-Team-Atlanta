import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class TaskFetchingError(Exception):
    def __init__(self, status_code, reason):
        self.status_code = status_code
        self.reason = reason


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
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        
        if response.status_code == 401:
            raise TaskFetchingError(401, "Client Error: Unauthorized")

        # Extract and return the tasks information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching Tasks: {e}")
        raise TaskFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching Tasks: {e}")
        raise TaskFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print(f"Unexpected error fetching Tasks:{e}")
        raise 

def get_task_custom_attribute_type_id(project_id, auth_token, attribute_name):

    taiga_url = os.getenv('TAIGA_URL')

    custom_attribute_api_url = f"{taiga_url}/task-custom-attributes?project={project_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:

        response = requests.get(custom_attribute_api_url, headers=headers)
        response.raise_for_status() 

        if response.status_code == 401:
            raise TaskFetchingError(401, "Client Error: Unauthorized")

        for res in response.json():
            print("response----------------------------->", res)
            if res["name"] == attribute_name:
                print("id---------------------------->",res["id"])
                return str(res["id"])

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching UserStory: {e}")
        raise TaskFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching UserStory: {e}")
        raise TaskFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching UserStory:")
        raise 

def get_custom_attribute_values_from_task(task_id, auth_token):

    taiga_url = os.getenv('TAIGA_URL')

    custom_attribute_api_url = f"{taiga_url}/tasks/custom-attributes-values/{task_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:

        response = requests.get(custom_attribute_api_url, headers=headers)
        response.raise_for_status() 
        
        if response.status_code == 401:
            raise TaskFetchingError(401, "Client Error: Unauthorized")

        custom_attribute = response.json()
        custom_attribute_data = custom_attribute['attributes_values']

        return custom_attribute_data

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching UserStory: {e}")
        raise TaskFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching UserStory: {e}")
        raise TaskFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching UserStory:")
        raise 
