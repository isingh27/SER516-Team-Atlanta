import requests
import os

class MilestoneFetchingError(Exception):
    def __init__(self, status_code, reason):
        self.status_code = status_code
        self.reason = reason

def get_milestone_by_id(milestone_id, auth_token):


    taiga_url = os.getenv('TAIGA_URL')
    taiga_api_url = f"{taiga_url}/milestones/{milestone_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type' : 'application/json'
    }

    try:
        response = requests.get(taiga_api_url, headers= headers)
        response.raise_for_status()
        print("response status code---------------",response.status_code)
        if response.status_code == 401:
            raise MilestoneFetchingError(401, "Client Error: Unauthorized")

        milestone_info = response.json()

        return milestone_info
    
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching milestone: {e}")
        raise MilestoneFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching milestone: {e}")
        raise MilestoneFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching milestone:")
        raise 

    except requests.exceptions.RequestException as e:
        print(f'error fetching milestones:{e}')
        return None