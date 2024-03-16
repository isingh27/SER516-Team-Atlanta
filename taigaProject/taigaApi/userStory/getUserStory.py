import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor

# Load environment variables from .env file
load_dotenv()


# Function to retrieve user stories for a specific project from the Taiga API
def get_user_story(project_id, auth_token):

    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the user stories API endpoint
    # for the specified project
    user_story_api_url = f"{taiga_url}/userstories?project={project_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    try:

        # Make a GET request to Taiga API to retrieve user stories
        response = requests.get(user_story_api_url, headers=headers)
        response.raise_for_status()  # Raise an exception for
        # HTTP errors (4xx or 5xx)

        # Extract and return the user stories information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.RequestException as e:

        # Handle errors during the API request and print an error message
        print(f"Error fetching project by slug: {e}")
        return None

def get_user_story_custom_attrib(project_id, auth_token):

    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the user stories API endpoint
    # for the specified project
    user_story_custom_attrib_api_url = f"{taiga_url}/userstory-custom-attributes?project={project_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    try:

        # Make a GET request to Taiga API to retrieve user stories cutom attributes
        response = requests.get(user_story_custom_attrib_api_url, headers=headers)
        response.raise_for_status()  # Raise an exception for
        # HTTP errors (4xx or 5xx)

        # Extract and return the user stories custom attributes info from the response
        custom_attributes = response.json()
        return custom_attributes

    except requests.exceptions.RequestException as e:

        # Handle errors during the API request and print an error message
        print(f"Error fetching project by slug: {e}")
        return None

def get_milestone_stats(sprint_id, auth_token):

    # Get Taiga API URL from environment variables
    taiga_url = os.getenv('TAIGA_URL')

    # Construct the URL for the project information API endpoint by sprint id
    project_api_url = f"{taiga_url}/milestones/{sprint_id}"

    # Define headers including the authorization token and content type
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
        'x-disable-pagination': 'True'
    }

    try:
        # Make a GET request to Taiga API to
        # retrieve milestone stats by sprint id
        response = requests.get(project_api_url, headers=headers)
        response.raise_for_status()

        # Extract and return the project information from the response
        project_info = response.json()
        return project_info

    except requests.exceptions.RequestException as e:
        # Handle errors during the API request and print an error message
        print(f"Error fetching milestone stats: {e}")
        return None
    
def get_user_story_details(user_story_id, auth_token):
    # Add your code here to get user story details
    # from the Taiga API
    taiga_url = os.getenv('TAIGA_URL')
    user_story_api_url = f"{taiga_url}/userstories/{user_story_id}"
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    try:
        response = requests.get(user_story_api_url, headers=headers)
        response.raise_for_status()
        return {
            "status": response.status_code,
            "data": response.json()
        }
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user story details: {e}")
        return {
            "status": 500,
            "data": None
        }
def append_points_date_data(date, completed, remaining):
    return {
        "date": date,
        "completed": completed,
        "remaining": remaining,
        "expected_remaining": 0
    }

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

def calc_burndown_day_data(auth_token, milestone, attribute_key):
    days_data = {}
    days_bv_data = {}
    days_total_data = {}
    start = datetime.fromisoformat(milestone["estimated_start"])
    finish = datetime.fromisoformat(milestone["estimated_finish"])
    milestone_start = start.date()
    milestone_finish = finish.date()
    
    if milestone["total_points"] is None:
        milestone["total_points"] = 0
    
    days_data[milestone_start] = append_points_date_data(milestone_start, 0, milestone["total_points"])
    days_data[milestone_start]["expected_remaining"] = milestone["total_points"]
    
    days_total_data[milestone_start] = append_points_date_data(milestone_start, 0, milestone["total_points"])
    days_total_data[milestone_start]["expected_remaining"] = milestone["total_points"]
    
    days_bv_data[milestone_start] = {
        "date": milestone_start,
        "completed": 0
    }
    
    total_business_value = { "bv": 0 }
    with ThreadPoolExecutor(max_workers=15) as executor:
        for user_story in milestone["user_stories"]:
            executor.submit(process_burndown_details, user_story, auth_token, total_business_value, days_data,
                            attribute_key, days_bv_data, days_total_data)

    expected_decrement = round(milestone["total_points"] / (finish - start).days, 2)
    update_points_days_data(days_data, milestone_start, milestone_finish, expected_decrement)
    update_points_days_data(days_total_data, milestone_start, milestone_finish, expected_decrement)

    days_bv_data[milestone_start]["remaining"] = total_business_value["bv"]
    days_bv_data[milestone_start]["expected_remaining"] = total_business_value["bv"]
    expected_bv_decrement = round((total_business_value["bv"])/(finish - start).days, 2)
    update_bv_days_data(days_bv_data, milestone_start, milestone_finish, expected_bv_decrement)

    return days_data, days_bv_data, days_total_data

def update_bv_days_data(days_bv_data, milestone_start, milestone_finish, expected_bv_decrement):
    for dt in daterange(milestone_start + timedelta(1), milestone_finish + timedelta(1)):
        if dt not in days_bv_data:
            days_bv_data[dt] = {
                "date": datetime.fromisoformat(str(dt)).date(),
                "completed": 0,
                "remaining": days_bv_data[dt - timedelta(1)]["remaining"]
            }
        else:
            days_bv_data[dt]["remaining"] = round(days_bv_data[dt - timedelta(1)]["remaining"] - days_bv_data[dt]["completed"], 2)
        days_bv_data[dt]["expected_remaining"] = round(days_bv_data[dt - timedelta(1)]["expected_remaining"] - expected_bv_decrement, 2)
        
        if days_bv_data[dt]["expected_remaining"] < 0:
            days_bv_data[dt]["expected_remaining"] = 0

def update_points_days_data(days_data, milestone_start, milestone_finish, expected_decrement):
    for dt in daterange(milestone_start + timedelta(1), milestone_finish + timedelta(1)):
        if dt not in days_data:
            days_data[dt] = append_points_date_data(dt, days_data[dt - timedelta(1)]["completed"], days_data[dt - timedelta(1)]["remaining"])
        else:
            days_data[dt]["remaining"] = round(days_data[dt - timedelta(1)]["remaining"] - days_data[dt]["completed"], 2)
        days_data[dt]["expected_remaining"] = round(days_data[dt - timedelta(1)]["expected_remaining"] - expected_decrement, 2)
        
        if days_data[dt]["expected_remaining"] < 0:
            days_data[dt]["expected_remaining"] = 0

# def process_burndown_details(user_story, auth_token, total_business_value, days_data, attribute_key, days_bv_data, days_total_data):
#     print(f"Processing user story: {user_story['id']} & attribute_key: {attribute_key}")
#     user_story_details = get_user_story_details(user_story['id'], auth_token)
#     if user_story_details["status"] == 200:
#         user_story_data = user_story_details["data"]
#         if user_story_data["status"]["name"] == "Ready":
#             if user_story_data["points"] is not None:
#                 if user_story_data["points"] > 0:
#                     user_story_data["points"] = round(user_story_data["points"], 2)
#                     user_story_data["business_value"] = round(user_story_data["business_value"], 2)
#                     user_story_data["date_created"] = datetime.fromisoformat(user_story_data["date_created"]).date()
#                     user_story_data["date_closed"] = datetime.fromisoformat(user_story_data["date_closed"]).date()
#                     if user_story_data["date_created"] not in days_data:
#                         days_data[user_story_data["date_created"]] = append_points_date_data(user_story_data["date_created"], 0, days_data[user_story_data["date_created"] - timedelta(1)]["remaining"])
#                     days_data[user_story_data["date_created"]]["completed"] += user_story_data["points"]
#                     days_data[user_story_data["date_created"]]["remaining"] -= user_story_data["points"]
#                     days_data[user_story_data["date_created"]]["expected_remaining"] -= user_story_data["points"]
#                     if user_story_data["date_closed"] not in days_data:
#                         days_data[user_story_data["date_closed"]] = append_points_date_data(user_story_data["date_closed"], days_data[user_story_data["date_closed"] - timedelta(1)]["completed"], days_data[user_story_data["date_closed"] - timedelta(1)]["remaining"])
#                     days_data[user_story_data["date_closed"]]["completed"] -= user_story_data["points"]
#                     days_data[user_story_data["date_closed"]]["remaining"] += user_story_data["points"]
#                     days_data[user_story_data["date_closed"]]["expected_remaining"] += user_story_data["points"]
#                     if user_story_data["date_created"] not in days_total_data:
#                         days_total_data[user_story_data["date_created"]] = append_points_date_data(user_story_data["date_created"], 0, days_total_data[user_story_data["date_created"] - timedelta(1)]["remaining"])
#                     days_total_data
#                     days_total_data[user_story_data["date_created"]]["completed"] += user_story_data["points"]
#                     days_total_data[user_story_data["date_created"]]["remaining"] -= user_story_data["points"]
#                     days_total_data[user_story_data["date_created"]]["expected_remaining"] -= user_story_data["points"]
#                     if user_story_data["date_closed"] not in days_total_data:
#                         days_total_data[user_story_data["date_closed"]] = append_points_date_data(user_story_data["date_closed"], days_total_data[user_story_data["date_closed"] - timedelta(1)]["completed"], days_total_data[user_story_data["date_closed"] - timedelta(1)]["remaining"])
#                     days_total_data[user_story_data["date_closed"]]["completed"] -= user_story_data["points"]
#                     days_total_data[user_story_data["date_closed"]]["remaining"] += user_story_data["points"]
#                     days_total_data[user_story_data["date_closed"]]["expected_remaining"] += user_story_data["points"]
#                     if user_story_data["date_created"] not in days_bv_data:
#                         days_bv_data[user_story_data["date_created"]] = {
#                             "date": user_story_data["date_created"],
#                             "completed": 0,
#                             "remaining": days_bv_data[user_story_data["date_created"] - timedelta(1)]["remaining"]
#                         }
#                     days_bv_data[user_story_data["date_created"]]["completed"] += user_story_data["business_value"]
#                     days_bv_data[user_story_data["date_created"]]["remaining"] -= user_story_data["business_value"]
#                     days_bv_data[user_story_data["date_created"]]["expected_remaining"] -= user_story_data["business_value"]
#                     if user_story_data["date_closed"] not in days_bv_data:
#                         days_bv_data[user_story_data["date_closed"]] = {
#                             "date": user_story_data["date_closed"],
#                             "completed": 0,
#                             "remaining": days_bv_data[user_story_data["date_closed"] - timedelta(1)]["remaining"]
#                         }
#                     days_bv_data[user_story_data["date_closed"]]["completed"] -= user_story_data["business_value"]
#                     days_bv_data[user_story_data["date_closed"]]["remaining"] += user_story_data["business_value"]
#                     days_bv_data[user_story_data["date_closed"]]["expected_remaining"] += user_story_data["business_value"]
#                     total_business_value["bv"] += user_story_data["business_value"]
#     else:
#         print(f"Error fetching user story details: {user_story_details['status']}")
#         return None

def process_burndown_details(user_story, auth_token, total_business_value, days_data, attribute_key, days_bv_data, days_total_data):
    print("Function called")
    tasks = get_tasks_by_story_id(user_story["id"], auth_token)
    extract_partial_burndown_data(user_story, tasks, days_data)
    print("Before calling get_business_value")
    business_value = get_business_value(user_story["id"], attribute_key, auth_token)
    print(f"After calling get_business_value: {business_value}")
    total_business_value["bv"] = total_business_value["bv"] + int(business_value)
    print(f"Total business value: {total_business_value['bv']}")
    extract_bv_burndown_data(user_story, int(business_value), days_bv_data)

    extract_total_burndown_data(user_story, days_total_data)

def get_tasks_by_story_id(story_id, auth_token):
    taiga_url = os.getenv('TAIGA_URL')
    task_api_url = f"{taiga_url}/tasks?user_story={story_id}"
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    try:
        response = requests.get(task_api_url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching tasks by story id: {e}")
        return None
    
def get_business_value(story_id, attribute, auth_token):
        print("Getting business value")
        taiga_url = os.getenv('TAIGA_URL')
        user_story_api_url = f"{taiga_url}/userstories/custom-attributes-values/{story_id}"
        headers = {
            'Authorization': f'Bearer {auth_token}',
            'Content-Type': 'application/json'
        }
        try:
            print ("Before making request")
            response = requests.get(user_story_api_url, headers=headers)
            response.raise_for_status()
            print ("After making request")
            custom_attributes = response.json()
            print ("Custom attributes are: ", custom_attributes)
            attributes_values = custom_attributes.get("attributes_values", {})
            business_value = attributes_values.get(str(attribute), 0)
            print ("Business value is: ", business_value)
            return business_value   
        except requests.exceptions.RequestException as e:
            print(f"Error fetching user story custom attributes: {e}")
            return 0
        

def extract_partial_burndown_data(user_story, tasks, days_data):
    for task in tasks:
        if task["status"]["name"] == "Ready":
            if task["points"] is not None:
                if task["points"] > 0:
                    task["points"] = round(task["points"], 2)
                    task["date_created"] = datetime.fromisoformat(task["date_created"]).date()
                    task["date_closed"] = datetime.fromisoformat(task["date_closed"]).date()
                    if task["date_created"] not in days_data:
                        days_data[task["date_created"]] = append_points_date_data(task["date_created"], 0, days_data[task["date_created"] - timedelta(1)]["remaining"])
                    days_data[task["date_created"]]["completed"] += task["points"]
                    days_data[task["date_created"]]["remaining"] -= task["points"]
                    days_data[task["date_created"]]["expected_remaining"] -= task["points"]
                    if task["date_closed"] not in days_data:
                        days_data[task["date_closed"]] = append_points_date_data(task["date_closed"], days_data[task["date_closed"] - timedelta(1)]["completed"], days_data[task["date_closed"] - timedelta(1)]["remaining"])
                    days_data[task["date_closed"]]["completed"] -= task["points"]
                    days_data[task["date_closed"]]["remaining"] += task["points"]
                    days_data[task["date_closed"]]["expected_remaining"] += task["points"]

def extract_bv_burndown_data(user_story, business_value, days_bv_data):
    if user_story["date_created"] not in days_bv_data:
        days_bv_data[user_story["date_created"]] = {
            "date": user_story["date_created"],
            "completed": 0,
            "remaining": days_bv_data[user_story["date_created"] - timedelta(1)]["remaining"]
        }
    print("Days BV Data: ", days_bv_data)
    days_bv_data[user_story["date_created"]]["completed"] += business_value
    days_bv_data[user_story["date_created"]]["remaining"] -= business_value
    days_bv_data[user_story["date_created"]]["expected_remaining"] -= business_value
    if user_story["date_closed"] not in days_bv_data:
        days_bv_data[user_story["date_closed"]] = {
            "date": user_story["date_closed"],
            "completed": 0,
            "remaining": days_bv_data[user_story["date_closed"] - timedelta(1)]["remaining"]
        }
    days_bv_data[user_story["date_closed"]]["completed"] -= business_value
    days_bv_data[user_story["date_closed"]]["remaining"] += business_value
    days_bv_data[user_story["date_closed"]]["expected_remaining"] += business_value


def extract_total_burndown_data(user_story, days_total_data):
    if user_story["date_created"] not in days_total_data:
        days_total_data[user_story["date_created"]] = append_points_date_data(user_story["date_created"], 0, days_total_data[user_story["date_created"] - timedelta(1)]["remaining"])
    days_total_data[user_story["date_created"]]["completed"] += user_story["points"]
    days_total_data[user_story["date_created"]]["remaining"] -= user_story["points"]
    days_total_data[user_story["date_created"]]["expected_remaining"] -= user_story["points"]
    if user_story["date_closed"] not in days_total_data:
        days_total_data[user_story["date_closed"]] = append_points_date_data(user_story["date_closed"], days_total_data[user_story["date_closed"] - timedelta(1)]["completed"], days_total_data[user_story["date_closed"] - timedelta(1)]["remaining"])
    days_total_data[user_story["date_closed"]]["completed"] -= user_story["points"]
    days_total_data[user_story["date_closed"]]["remaining"] += user_story["points"]
    days_total_data[user_story["date_closed"]]["expected_remaining"] += user_story["points"]

def get_burndown_chart_metric_detail(milestone_id, attrib_key, auth_token):
    milestone = get_milestone_stats(milestone_id, auth_token)
    print("Milestone: ", milestone)
    partial_burndown, bv_burndown, total_burndown = calc_burndown_day_data(auth_token, milestone, attrib_key)
    partial_burndown = list(partial_burndown.values())
    partial_burndown.sort(key=lambda l: l["date"])
    bv_burndown = list(bv_burndown.values())
    bv_burndown.sort(key=lambda l: l["date"])
    total_burndown = list(total_burndown.values())
    total_burndown.sort(key=lambda l: l["date"])
    
    return {
        "partial_burndown": {
            "partial_burndown_data": partial_burndown,
        },
        "bv_burndown": {
            "bv_burndown_data": bv_burndown
        },
        "total_burndown": {
            "total_burndown_data": total_burndown
        }
    }