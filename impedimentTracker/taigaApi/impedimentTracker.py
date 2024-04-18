import getpass
import json
from datetime import datetime, timedelta
import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_project_impediments(project_id, auth_token):
    taiga_url = os.getenv('TAIGA_URL')
    impediment_api_url = f"{taiga_url}/issue-statuses?project={project_id}"
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }
    try:
        response = requests.get(impediment_api_url, headers=headers)
        response.raise_for_status()
        impediments = response.json()
        return impediments
    except requests.exceptions.RequestException as e:
        print(f"Error fetching impediments: {e}")
        return None