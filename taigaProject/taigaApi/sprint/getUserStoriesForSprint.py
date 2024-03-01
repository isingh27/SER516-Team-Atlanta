import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


def get_user_stories_for_sprint(auth_token, sprint_id):
    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    # Get all user stories for a specific sprint
    response = requests.get(
        f"{taiga_url}/userstories?milestone={sprint_id}",
        headers=headers)
    user_stories = response.json()

    task_history = {}

    for user_story in user_stories:
        # Get all tasks for a specific user story
        response = requests.get(
            f"{taiga_url}/tasks?user_story={user_story['id']}",
            headers=headers)
        tasks = response.json()

        for task in tasks:
            # Get the history for each task
            response = requests.get(
                f"{taiga_url}/history/task/{task['id']}",
                headers=headers)
            history = response.json()

            unique_tasks_for_day = set()

            for history_entry in history:
                if 'status' in history_entry['values_diff']:
                    date = datetime.strptime(
                        history_entry['created_at'],
                        '%Y-%m-%dT%H:%M:%S.%fZ').date()

                    status_list = history_entry['values_diff']['status']
                    status = status_list[-1].lower() if status_list else None

                    task_id = task['id']

                    if (date, task_id) not in unique_tasks_for_day:
                        unique_tasks_for_day.add((date, task_id))

                        if date not in task_history:
                            task_history[date] = {
                                'new': 0, 'in progress': 0,
                                'ready for test': 0, 'blocked': 0, 'done': 0}

                        if status:
                            task_history[date][status] += 1

    print(task_history)
    return task_history
