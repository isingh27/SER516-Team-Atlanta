import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


#Function to get custom attribute data from issue_id
def get_custom_attribute_value_by_issue_id(issue_id, attribute_id, auth_token):
    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for collecting the issues for project.
    custom_attribute_data_api_url = f"{taiga_url}/issues/custom-attributes-values/{issue_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:
        # Make a GET request to Taiga API
        response = requests.get(custom_attribute_data_api_url, headers=headers)
        response.raise_for_status()

        # Extract and return the issue response list from the response
        custom_attribute_info = response.json()
        print("asdnaksjdnaksjdnaksjdnaksjdnakjsdnaksjdnaksjdnaksjdnaksjdaksd",attribute_id)
        return custom_attribute_info['attributes_values'][attribute_id]

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching issues by project id: {e}")
        return None
    
def get_custom_attribute_type_id_for_issue(project_id, auth_token, attribute_name):

    taiga_url = os.getenv('TAIGA_URL')

    custom_attribute_api_url = f"{taiga_url}/issue-custom-attributes?project={project_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:

        response = requests.get(custom_attribute_api_url, headers=headers)
        response.raise_for_status() 

        for res in response.json():
            if res["name"] == attribute_name:
                return str(res["id"])

    except requests.exceptions.RequestException as e:

        print(f"Error fetching project by slug: {e}")
        return None
