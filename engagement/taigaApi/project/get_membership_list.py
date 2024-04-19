import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_membership_list(project_id, auth_token):
    """ Return the ID and name of member in a project.

    Args:
        project_id (str): ID of the Taiga Project.
        auth_token (str): Authorization for Taiga Project.

    Returns:
        list: Members of project.
    """
    taiga_url = os.getenv('TAIGA_URL')

    project_api_url = f"{taiga_url}/memberships?project={project_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:
        response = requests.get(project_api_url, headers=headers)
        response.raise_for_status()

        project_info = response.json()
        membership_list = {
            str(member_detail["user"]): member_detail["full_name"]
            for member_detail in project_info
            if member_detail["role_name"] == "Developer"
        }

        return membership_list

    except requests.exceptions.RequestException as e:
        print(f"Error fetching project by slug: {e}")
        return None
