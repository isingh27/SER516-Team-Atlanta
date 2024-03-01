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
        'x-disable-pagination': 'True'
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
            response.raise_for_status()  # Raise an exception
            # for HTTP errors (4xx or 5xx)
            history_data = response.json()

            # Extract the date when the task transitioned
            # from 'New' to 'In progress'
            in_progress_date = extract_new_to_in_progress_date(history_data)

            # Convert finished_date and in_progress_date to datetime objects
            finished_date = datetime.fromisoformat(finished_date[:-1])
            if in_progress_date:
                in_progress_date = datetime.fromisoformat(
                    str(in_progress_date)[:-6])

                # Calculate cycle time and increment closed_tasks count
                cycle_time += (finished_date - in_progress_date).days
                closed_tasks += 1

        except requests.exceptions.RequestException as e:
            # Handle errors during the API request and print an error message
            print(f"Error fetching project by slug: {e}")

    # Return a list containing cycle_time and closed_tasks count
    return [cycle_time, closed_tasks]


def get_task_cycle_times(tasks, auth_token):
    """Retrieves task history and calculates cycle time, start, and end dates.

    Args:
        tasks: A list of task dictionaries with 'id' and 'finished_date' keys.
        auth_token: The Taiga API authorization token.

    Returns:
        A list of tuples, where each tuple contains:
            (cycle_time, start_date, end_date)
    """

    taiga_url = os.getenv('TAIGA_URL')
    headers = {
        'authorization': f'Bearer {auth_token}',
        'content-type': 'application/json',
        'x-disable-pagination': 'True'
    }

    task_data = []

    for task in tasks:
        task_history_url = f"{taiga_url}/history/task/{task['id']}"
        finished_date = task["finished_date"]
        ref = task["ref"]

        try:
            response = requests.get(task_history_url, headers=headers)
            response.raise_for_status()
            history_data = response.json()

            in_progress_date = extract_new_to_in_progress_date(history_data)

            if in_progress_date:
                finished_date = datetime.fromisoformat(finished_date[:-1])
                in_progress_date = datetime.fromisoformat(
                    str(in_progress_date)[:-6])
                cycle_time = (finished_date - in_progress_date).days

                task_data.append((cycle_time, in_progress_date,
                                  finished_date, ref))

        except requests.exceptions.RequestException as e:
            print(f"Error fetching task history: {e}")

    return task_data


# Function to retrieve user stories and calculate cycle times
def get_user_story_cycle_times(user_stories, auth_token):
    """Retrieves user story history and calculates cycle time,
    start, and end dates.

    Args:
        user_stories: A list of user story dictionaries with 'id' and
        'finished_date' keys.
        auth_token: The Taiga API authorization token.

    Returns:
        A list of tuples, where each tuple contains:
            (cycle_time, start_date, end_date)
    """

    taiga_url = os.getenv('TAIGA_URL')
    headers = {
        'authorization': f'Bearer {auth_token}',
        'content-type': 'application/json',
        'x-disable-pagination': 'True'
    }

    user_story_data = []

    for user_story in user_stories:
        url = f"{taiga_url}/history/userstory/{user_story['id']}"
        user_story_history_url = url
        finished_date = user_story["finish_date"]
        ref = user_story["ref"]

        try:
            response = requests.get(user_story_history_url, headers=headers)
            response.raise_for_status()
            history_data = response.json()

            sprint_ready_date = extract_new_to_sprint_ready_date(history_data)
            print("sprint_ready_date", sprint_ready_date)

            if sprint_ready_date:
                finished_date = datetime.fromisoformat(finished_date[:-1])
                sprint_ready_date = datetime.fromisoformat(
                    str(sprint_ready_date)[:-6])
                cycle_time = (finished_date - sprint_ready_date).days

                user_story_data.append((cycle_time, sprint_ready_date,
                                        finished_date, ref))

        except requests.exceptions.RequestException as e:
            print(f"Error fetching user story history: {e}")

    return user_story_data


# Function to extract the date when a task transitioned
# from 'New' to 'In progress'
def extract_new_to_in_progress_date(history_data):
    for event in history_data:
        values_diff = event.get("values_diff", {})
        if "status" in values_diff and values_diff["status"] == [
                "New", "In progress"]:
            created_at = datetime.fromisoformat(event["created_at"])
            return created_at
    return None

# Function to extract the date when a user story transitioned from
# 'New' to 'Sprint Ready'


def extract_new_to_sprint_ready_date(history_data):
    for event in history_data:
        values_diff = event.get("values_diff", {})
        if "status" in values_diff and values_diff[
                "status"] == ["New", "Sprint-ready"]:
            created_at = datetime.fromisoformat(event["created_at"])
            return created_at
    return None
