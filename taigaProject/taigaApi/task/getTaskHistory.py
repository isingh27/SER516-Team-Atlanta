import os
import requests
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()


# Function to retrieve task history and calculate cycle time for closed tasks
def get_task_history(tasks, auth_token):

    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    # Initialize variables to store cycle time and count of closed tasks
    cycle_time = 0
    closed_tasks = 0

    # Iterate over each task to retrieve task history and calculate cycle time
    for task in tasks:
        task_history_url = f"{taiga_url}/history/task/{task['id']}"
        finished_date = task["finished_date"]
        try:
            # Make a GET request to Taiga API to retrieve task history
            response = requests.get(task_history_url, headers=headers)
            response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
            history_data = response.json()

            # Extract the date when the task transitioned from 'New' to 'In progress'
            in_progress_date = extract_new_to_in_progress_date(history_data)

            # Convert finished_date and in_progress_date to datetime objects
            finished_date = datetime.fromisoformat(finished_date[:-1])
            if in_progress_date:
                in_progress_date = datetime.fromisoformat(str(in_progress_date)[:-6])

                # Calculate cycle time and increment closed_tasks count
                cycle_time += (finished_date - in_progress_date).days
                closed_tasks += 1

        except requests.exceptions.RequestException as e:
            # Handle errors during the API request and print an error message
            print(f"Error fetching project by slug: {e}")

    # Return a list containing cycle_time and closed_tasks count
    return [cycle_time, closed_tasks]


# Function to extract the date when a task transitioned from 'New' to 'In progress'
def extract_new_to_in_progress_date(history_data):
    for event in history_data:
        values_diff = event.get("values_diff", {})
        if "status" in values_diff and values_diff["status"] == ["New", "In progress"]:
            created_at = datetime.fromisoformat(event["created_at"])
            return created_at
    return None
