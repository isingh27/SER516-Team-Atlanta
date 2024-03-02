import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
import json
# Load environment variables from a .env file
load_dotenv()


def get_task_status(sprint_id, auth_token):
    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the project information API endpoint by sprint id
    project_api_url = f"{taiga_url}/tasks?milestone={sprint_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    try:
        # Make a GET request to Taiga API to retrieve tasks by sprint id
        response = requests.get(project_api_url, headers=headers)
        response.raise_for_status()

        # Extract and return the task information from the response
        tasks = response.json()
        sprint_tasks = [{'id': task['id'], 'name': task['subject'],
                         'status': task['status_extra_info']['name'],
                         'sprint_id': sprint_id} for task in tasks]

        return sprint_tasks

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching task status: {e}")
        return None


def get_task_status_count_by_date(tasks, start_date, end_date):
    date_format = "%Y-%m-%d"
    start_dt = datetime.strptime(start_date, date_format)
    end_dt = datetime.strptime(end_date, date_format)
    current_dt = start_dt

    # Initialize counters for each date in the range
    task_counts = {current_dt.strftime(date_format): {"new": 0, "closed": 0, "inProgress": 0} for current_dt in (start_dt + timedelta(days=n) for n in range((end_dt - start_dt).days + 1))}

    # Process each task
    for task in tasks:
        created_date = datetime.strptime(task["created_date"], "%Y-%m-%dT%H:%M:%S.%fZ").date()
        finished_date = datetime.strptime(task["finished_date"], "%Y-%m-%dT%H:%M:%S.%fZ").date() if task.get("finished_date") else None

        created_str = created_date.strftime(date_format)
        finished_str = finished_date.strftime(date_format) if finished_date and finished_date <= end_dt.date() else None

        # Increment "new" for created_date
        if created_str in task_counts:
            task_counts[created_str]["new"] += 1

        # Increment "closed" for finished_date if within range
        if finished_str and finished_str in task_counts:
            task_counts[finished_str]["closed"] += 1

        # Calculate "inProgress" for each day the task was actually in progress
        for date_key in task_counts:
            current_date = datetime.strptime(date_key, date_format).date()
            if created_date <= current_date and (not finished_date or current_date <= finished_date):
                task_counts[date_key]["inProgress"] += 1

    # Correct "inProgress" for each day
    for date_key in task_counts:
        task_counts[date_key]["inProgress"] = max(0, task_counts[date_key]["inProgress"] - task_counts[date_key]["new"] - task_counts[date_key]["closed"])

    # Format and return the output
    output = [{"date": date, "new": counts["new"], "closed": counts["closed"], "inProgress": counts["inProgress"]} for date, counts in sorted(task_counts.items())]
    
    return output