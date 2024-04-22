import getpass
import json
from datetime import datetime, timedelta
import getpass
import json
from datetime import datetime, timedelta
import os
import requests
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

def get_project_impediments(project_id, auth_token):
    taiga_url = os.getenv('TAIGA_URL')
    impediment_api_url = f"{taiga_url}/issues?project={project_id}"
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }
    try:
        response = requests.get(impediment_api_url, headers=headers)
        response.raise_for_status()
        impediments = response.json()
        
        return transform_impediments_data(impediments)
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching impediments: {e}")
        return None

def transform_impediments_data(impediments):
    impediments.sort(key=lambda x: x['created_date'])

    transformed_data = [["Date", "Impediments On Day", "Total Impediments"]]
    total_impediments_by_date = {}
    finished_dates = []

    for impediment in impediments:
        created_date = impediment.get('created_date')
        is_closed = impediment.get('is_closed', False)
        finished_date = impediment.get('finished_date')

        if created_date:
            date = created_date.split('T')[0]

            if date not in total_impediments_by_date:
                total_impediments_by_date[date] = 0
                transformed_data.append([date, 0, 0])

            total_impediments_by_date[date] += 1

            if is_closed and finished_date:
                finished_date = finished_date.split('T')[0]
                if finished_date not in finished_dates:
                    finished_dates.append(finished_date)

        while finished_dates and date > finished_dates[0]:
            if finished_dates[0] in total_impediments_by_date:
                total_impediments_by_date[finished_dates[0]] -= 1
            finished_dates.pop(0)

        if date in total_impediments_by_date:
            transformed_data[-1][1] = total_impediments_by_date[date]
            transformed_data[-1][2] = sum(total_impediments_by_date.values())

    return transformed_data
