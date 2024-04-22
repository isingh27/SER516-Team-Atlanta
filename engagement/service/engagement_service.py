import requests
import os

from taigaApi.project.get_membership_list import get_membership_list

def get_engagement(project_id, auth_token):
    """
    Returns the Member stat from Taiga
    
    Args:
        project_id (string): ID of the project.
        auth_token (string): Authorization Token of the user
        
    Returns:
        dict: Stats for each user
    """
    taiga_url = os.getenv("TAIGA_URL")

    member_stats_api_url = f"{taiga_url}/projects/{project_id}/member_stats"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    member_names = get_membership_list(project_id, auth_token)


    try:
        response = requests.get(member_stats_api_url, headers = headers)
        response.raise_for_status()
        member_stats = response.json()
        member_stats_info = {}

        for member_stat in member_stats:
            if member_stats_info.get(member_stat) is None:
                member_stats_info[member_stat] = {}
                for stat in member_stats[member_stat]:
                        if member_names.get(stat) is not None:
                            member_stats_info[member_stat][member_names[stat]] = member_stats[member_stat][stat]

        return member_stats_info

    except requests.exceptions.RequestException as e:
        print(f"Error fetching member statistics: {e}")
        return None
