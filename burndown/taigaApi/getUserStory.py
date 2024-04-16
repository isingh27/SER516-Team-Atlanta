import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
import redis
import threading
import json
from flask import jsonify
from fastapi import HTTPException

# Load environment variables from .env file
load_dotenv()
r_userstory = redis.StrictRedis(host='localhost', port=6379, db=0)

class UserStoryFetchingError(Exception):
    def __init__(self, status_code, reason):
        self.status_code = status_code
        self.reason = reason


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

def get_custom_attribute_type_id(project_id, auth_token, attribute_name):

    taiga_url = os.getenv('TAIGA_URL')

    custom_attribute_api_url = f"{taiga_url}/userstory-custom-attributes?project={project_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:

        response = requests.get(custom_attribute_api_url, headers=headers)
        response.raise_for_status() 

        if response.status_code == 401:
            raise UserStoryFetchingError(401, "Client Error: Unauthorized")

        for res in response.json():
            if res["name"] == attribute_name:
                return str(res["id"])

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching UserStory: {e}")
        raise UserStoryFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching UserStory: {e}")
        raise UserStoryFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching UserStory:")
        raise 


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
        "completed": 0,
        "remaining": 0,
    }
    
    total_business_value = { "bv": 0 }
    with ThreadPoolExecutor(max_workers=15) as executor:
        for user_story in milestone["user_stories"]:
            print ("User story in calc_burndown_day_data: ", user_story)
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


def process_burndown_details(user_story, auth_token, total_business_value, days_data, attribute_key, days_bv_data, days_total_data):
    print("Function called")
    tasks = get_tasks_by_story_id(user_story["id"], auth_token)
    extract_partial_burndown_data(user_story, tasks, days_data)
    print("Before calling get_business_value")
    business_value = get_business_value(user_story["id"], attribute_key, auth_token)
    print(f"After calling get_business_value: {business_value}")
    total_business_value["bv"] = total_business_value["bv"] + int(business_value)
    days_bv_data[user_story["created_date"]] = {
        "date": datetime.fromisoformat(user_story["created_date"]).date(),
        "completed": 0,
        "remaining": total_business_value["bv"]
    }
    print(f"Total business value: {total_business_value['bv']}")
    print ("User story in process_burndown_details: ", user_story)
    print ("Days BV Data in process_burndown_details: ", days_bv_data)
    extract_bv_burndown_data(user_story, business_value, days_bv_data)

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
    
def get_business_value(user_story_id, auth_token):
    taiga_url = os.getenv('TAIGA_URL')

    custom_attribute_api_url = f"{taiga_url}/userstories/custom-attributes-values/{user_story_id}"

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json',
    }

    try:

        response = requests.get(custom_attribute_api_url, headers=headers)
        response.raise_for_status() 
        
        if response.status_code == 401:
            raise UserStoryFetchingError(401, "Client Error: Unauthorized")

        custom_attribute = response.json()
        custom_attribute_data = custom_attribute['attributes_values']

        return custom_attribute_data

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching UserStory: {e}")
        raise UserStoryFetchingError(e.response.status_code, e.response.reason)

    except requests.exceptions.ConnectionError as e:
        print(f"Connection error fetching UserStory: {e}")
        raise UserStoryFetchingError("CONNECTION_ERROR", str(e))

    except Exception as e:
        print("Unexpected error fetching UserStory:")
        raise 
        

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



def extract_bv_burndown_data(user_story, business_value_str, days_bv_data):
    try:
        business_value = int(business_value_str)

        created_date = datetime.strptime(user_story["created_date"], "%Y-%m-%dT%H:%M:%S.%fZ").date()
        finish_date = datetime.strptime(user_story["finish_date"], "%Y-%m-%dT%H:%M:%S.%fZ").date()

        # Note: No change to 'remaining' on creation, only on completion
        if finish_date in days_bv_data:
            days_bv_data[finish_date]["completed"] += business_value
            days_bv_data[finish_date]["remaining"] -= business_value
        else:
            # Initialize finish_date if not present; decrease 'remaining' due to completion
            prev_days = [d for d in days_bv_data if d < finish_date]
            prev_day_remaining = days_bv_data[max(prev_days, default=finish_date)].get("remaining", 0) if prev_days else 0
            days_bv_data[finish_date] = {
                "date": finish_date,
                "completed": business_value,
                "remaining": prev_day_remaining - business_value
            }

        # Forward-fill the 'remaining' for in-between dates if necessary
        update_remaining_for_inbetween_days(days_bv_data, created_date, finish_date)

    except Exception as e:
        print(f"Error extracting business value burndown data: {e}")

def update_remaining_for_inbetween_days(days_bv_data, created_date, finish_date):
    """Ensure 'remaining' values are correctly forward-filled between created and finish dates, not adjusting them."""
    sorted_dates = sorted(days_bv_data.keys())
    created_index = sorted_dates.index(created_date) if created_date in sorted_dates else -1
    finish_index = sorted_dates.index(finish_date) if finish_date in sorted_dates else -1

    for i in range(created_index + 1, finish_index):
        current_date = sorted_dates[i]
        if current_date not in days_bv_data:
            prev_date = sorted_dates[i - 1]
            days_bv_data[current_date] = {
                "date": current_date,
                "completed": 0,
                "remaining": days_bv_data[prev_date]["remaining"]  # Carry forward without decrement
            }


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
    print("BV Burndown: ", bv_burndown)
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


def get_userstory_custom_attribute_burndown_for_sprint(project_id, sprint_id, auth_token, custom_attribute_name):
    """
    Description
    -----------
    Gets the user_story based on the project_id, filters it based on the sprint_id
    and uses the custom_attribute to get back the custom_attribute_values

    Arguments
    ---------
    project_id, print_id, auth_token, custom_attribute_name

    Returns
    -------
    A map of date and business value completed.
    """
    try:
        response = {}
        
        serialized_cached_data = r_userstory.get(f'userstory_business_value_data:{sprint_id}')
        if serialized_cached_data:

            background_thread = threading.Thread(target=userstory_custom_attribute_burndown_for_sprint_process, args=(project_id, sprint_id, auth_token, custom_attribute_name))
            background_thread.start()
                    
            response = json.loads(serialized_cached_data)

            return response
        
        response = userstory_custom_attribute_burndown_for_sprint_process(project_id, sprint_id, auth_token, custom_attribute_name)
        return response
    except:
        raise HTTPException(status_code=401, detail="Missing custom attribute")
    # response = userstory_custom_attribute_burndown_for_sprint_process(project_id, sprint_id, auth_token, custom_attribute_name)
    # return response


def userstory_custom_attribute_burndown_for_sprint_process(project_id, sprint_id, auth_token, custom_attribute_name):
    response = {}
    formatted_response = []  # This will hold the final list of dictionaries

    sprint_data = get_milestone_stats(sprint_id, auth_token)
    user_stories = sprint_data['user_stories']

    if not user_stories:
        return {"bv_burndown": {"bv_burndown_data": []}}

    total_custom_attribute_value = 0

    start_date = datetime.strptime(sprint_data['estimated_start'], "%Y-%m-%d")
    end_date = datetime.strptime(sprint_data['estimated_finish'], "%Y-%m-%d")

    # Initialize response dictionary for each day
    for date in range((end_date - start_date).days + 1):
        current_date = start_date + timedelta(days=date)
        response[current_date.strftime("%Y-%m-%d")] = 0

    # Populate response with custom attribute values
    for user_story in user_stories:
        user_story_id = user_story['id']
        custom_attribute_data = get_business_value(user_story_id, auth_token)
        custom_attribute_type_id = get_custom_attribute_type_id(project_id, auth_token, custom_attribute_name)

        if not custom_attribute_data:
            custom_attribute_data = {'40203': '5'}  # Hardcoded value

        total_custom_attribute_value += int(custom_attribute_data[custom_attribute_type_id])

        if user_story['is_closed'] and user_story['finish_date']:
            current_date = datetime.strptime(user_story['finish_date'], "%Y-%m-%dT%H:%M:%S.%fZ")
            prepared_current_date = current_date.strftime("%Y-%m-%d")

            if prepared_current_date in response:
                response[prepared_current_date] += int(custom_attribute_data[custom_attribute_type_id])
            else:
                response[prepared_current_date] = int(custom_attribute_data[custom_attribute_type_id])

    # Prepare formatted response from the calculated data
    for date in sorted(response):
        if date != "0":  # Exclude the initial '0' key used for total calculation
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            formatted_date = date_obj.strftime("Mon, %d %b %Y 00:00:00 GMT")
            remaining = total_custom_attribute_value - response[date]
            completed = response[date] if response[date] != 0 else 0
            formatted_response.append({
                "date": formatted_date,
                "remaining": remaining,
                "completed": completed
            })
            total_custom_attribute_value = remaining

    # Wrap the response in the specified format
    final_output = {
            "bv_burndown": {
                "bv_burndown_data": formatted_response
            }
    }

    # Store updated data in Redis if changed
    serialized_response = json.dumps(final_output)
    serialized_cached_data = r_userstory.get(f'userstory_business_value_data:{sprint_id}')

    if serialized_cached_data != serialized_response:
        r_userstory.set(f'userstory_business_value_data:{sprint_id}', serialized_response)
        print("Stored Redis key:", r_userstory.get(f'userstory_business_value_data:{sprint_id}'))

    return final_output
