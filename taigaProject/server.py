from flask import Flask, jsonify, request
from taigaApi.authenticate import authenticate
from taigaApi.project.getProjectBySlug import (
    get_project_by_slug,
    get_project_by_user
)
from taigaApi.task.getTaskHistory import (
    get_task_history,
    get_task_cycle_times,
    get_user_story_cycle_times)
from taigaApi.task.getTasks import get_closed_tasks, get_closed_user_stories, get_tasks
from taigaApi.task.getTaskStatus import get_task_status, get_task_status_count_by_date
from taigaApi.sprint.getMilestoneStats import get_milestone_stats
from taigaApi.sprint.getAllSprintIDs import get_all_sprint_ids
from taigaApi.userStory.getUserStory import get_burndown_chart_metric_detail, get_user_story_custom_attrib
from taigaApi.sprint.getUserStoriesForSprint import get_user_stories_for_sprint
from flask_cors import CORS
from datetime import date, datetime, timedelta
from collections import defaultdict

app = Flask(__name__)
CORS(app)


@app.route("/")
def sampleRoute():
    response = jsonify({
        "message": "Hello, World!"
    })
    return response


@app.route("/authenticate", methods=["POST"])
def auth():
    username = request.json['username']
    password = (request.json['password'])
    print("username", username)
    print("pswd", password)
    auth_token = authenticate(username, password)
    print(auth_token)
    return jsonify({"token": auth_token, "status": "success"})


@app.route("/projectDetails", methods=["POST"])
def projectDetails():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    projectSlug = request.json['projectSlug']
    project_info = get_project_by_slug(projectSlug, token)
    if project_info is None:
        return jsonify({"status": "error", "message": "Project not found"})
    return jsonify({"data": project_info, "status": "success"})


@app.route("/sprints", methods=["POST"])
def all_sprints():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    project_id = request.json['projectId']

    sprint_ids = get_all_sprint_ids(project_id, token)

    if sprint_ids is None:
        return jsonify({"message": "Error fetching sprint IDs"}), 500

    return jsonify({"sprint_ids": sprint_ids, "status": "success"})


@app.route("/cycleTime", methods=["POST"])
def cycle_time():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401
    # Send project Id as a parameter in JSON format.
    project_id = request.json['projectId']
    print(project_id)
    tasks = get_closed_tasks(project_id, token)
    cycle_time, closed_task = get_task_history(tasks, token)
    if closed_task == 0:
        return jsonify({"message": "No closed tasks found"}), 404
    avg_cycle_time = round((cycle_time / closed_task), 2)
    return jsonify({"avg_cycle_time": avg_cycle_time, "status": "success"})


@app.route("/leadTime", methods=["POST"])
def lead_time():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401
    # Send project Id as a parameter in JSON format.
    project_id = request.json['projectId']
    tasks = get_closed_tasks(project_id, token)

    output = []
    for task in tasks:
        created_date = datetime.fromisoformat(task["created_date"])
        finished_date = datetime.fromisoformat(task['finished_date'])
        lead_time = (finished_date - created_date).days
        output.append({"task": task, "finished_date": finished_date,
                       "lead_time": lead_time, "refId": task['ref']})
    return jsonify({"plotData": output, "status": "success"})


@app.route("/cycleTimesPerTask", methods=["POST"])
def cycle_time_per_task():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    project_id = request.json['projectId']
    closed_tasks = get_closed_tasks(project_id, token)

    if not closed_tasks:  # Check if the list of closed tasks is empty
        return jsonify({"message": "No closed tasks found"}), 404

    cycle_times = get_task_cycle_times(closed_tasks, token)

    response_data = []
    for cycle_time, start_date, end_date, ref in cycle_times:
        response_data.append({
            "cycle_time": cycle_time,
            "start_date": start_date,
            "end_date": end_date,
            "refId": ref   # refId is the task id
        })

    return jsonify({"data": response_data, "status": "success"})


@app.route("/cycleTimesPerUserStory", methods=["POST"])
def cycle_time_per_user_story():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    project_id = request.json['projectId']
    closed_user_stories = get_closed_user_stories(project_id, token)

    if not closed_user_stories:
        return jsonify({"message": "No closed user stories found"}), 404

    cycle_times = get_user_story_cycle_times(closed_user_stories, token)

    response_data = []
    for cycle_time, start_date, end_date, ref in cycle_times:
        response_data.append({
            "cycle_time": cycle_time,
            "start_date": start_date,
            "end_date": end_date,
            "refId": ref
        })

    return jsonify({"data": response_data, "status": "success"})


@app.route("/burndownChart", methods=["POST"])
def burndown_chart():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    sprint_id = request.json['sprintId']

    if sprint_id is None:
        return jsonify({"message": "No current sprint found"}), 404

    milestone_stats = get_milestone_stats(sprint_id, token)
    print(milestone_stats)
    if milestone_stats is None:
        return jsonify({"message": "Error fetching milestone stats"}), 500

    for index, day_data in enumerate(milestone_stats["days"], start=1):
        day_data["id"] = index

    response_data = {
        "days": milestone_stats["days"],
        "name": milestone_stats["name"],
        "total_points": milestone_stats["total_points"]
    }

    return jsonify({"burndown_chart_data": response_data, "status": "success"})


@app.route("/sprintDetails/<id>", methods=["GET"])
def getSprintDetails(id):
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    if id is None:
        return jsonify({"message": "No current sprint found"}), 404

    return get_milestone_stats(id, token)


@app.route("/workInProgress", methods=["POST"])
def work_in_progress():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    project_id = request.json['projectId']
    sprint_ids = get_all_sprint_ids(project_id, token)

    response_data = {}

    for sprint in sprint_ids:
        sprint_name = sprint[0]
        sprint_id = sprint[1]
        sprint_tasks = get_task_status(sprint_id, token)

        status_counts = defaultdict(int)
        total_tasks = len(sprint_tasks)

        for task in sprint_tasks:
            status = task['status']
            status_counts[status] += 1

        percentages = {status.lower(): (count / total_tasks) * 100 if
                       total_tasks > 0 else 0 for status, count in
                       status_counts.items()}

        sprint_data = {
            "sprint_id": sprint_id,
            "New": percentages.get("new", 0),
            "In Progress": percentages.get("in progress", 0),
            "Ready to test": percentages.get("ready for test", 0),
            "Done": percentages.get("done", 0),
            "Blocked": percentages.get("blocked", 0),
        }

        response_data[sprint_name] = {"sprint_id": sprint_id, **sprint_data}

    return jsonify({"data": response_data, "status": "success"})


@app.route("/throughputDaily", methods=["POST"])
def throughput_daily():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    sprint_id = request.json['sprintId']
    project_id = request.json['projectId']

    if sprint_id is None:
        return jsonify({"message": "No current sprint found"}), 404

    closed_tasks = get_closed_tasks(project_id, token)
    milestone_stats = get_milestone_stats(sprint_id, token)
    date_format = "%Y-%m-%d"
    st_date = datetime.strptime(milestone_stats['estimated_start'],
                                date_format).date()
    fin_date = datetime.strptime(milestone_stats['estimated_finish'],
                                 date_format).date()

    tasks_completed_per_day = {}
    for task in closed_tasks:
        finished_date_str = task.get('finished_date', '').split('T')[0]
        if finished_date_str:
            finished_date = datetime.strptime(finished_date_str,
                                              date_format).date()
            tasks_completed_per_day
            [finished_date] = tasks_completed_per_day.get(finished_date, 0) + 1

    response_data = []
    current_date = st_date
    while current_date <= fin_date:
        tasks_done = tasks_completed_per_day.get(current_date, 0)
        response_data.append({
            "date": current_date.strftime("%m-%d-%y"),
            "tasks_done": tasks_done
        })
        current_date += timedelta(days=1)

    return jsonify({"throughput_data": response_data, "status": "success"})


@app.route("/throughputHistogram", methods=["POST"])
def throughput_histogram():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    sprint_id = request.json['sprintId']
    project_id = request.json['projectId']

    if sprint_id is None:
        return jsonify({"message": "No current sprint found"}), 404

    closed_tasks = get_closed_tasks(project_id, token)
    milestone_stats = get_milestone_stats(sprint_id, token)
    date_format = "%Y-%m-%d"
    st_date = datetime.strptime(milestone_stats
                                ['estimated_start'], date_format).date()
    fin_date = datetime.strptime(milestone_stats
                                 ['estimated_finish'], date_format).date()

    tasks_completed_per_day = {}
    for task in closed_tasks:
        finished_date_str = task.get('finished_date', '').split('T')[0]
        if finished_date_str:
            finished_date = datetime.strptime(finished_date_str,
                                              date_format).date()
            if st_date <= finished_date <= fin_date:
                tasks_completed_per_day
                [finished_date] = tasks_completed_per_day.get(finished_date, 0)
                + 1

    # This dictionary will hold the frequency of days
                # for each number of tasks completed.
    tasks_frequency = {}
    for tasks_done in tasks_completed_per_day.values():
        tasks_frequency[tasks_done] = tasks_frequency.get(tasks_done, 0) + 1

    # Preparing the data for the histogram.
    histogram_data = [{"tasks_completed": k, "days_count": v}
                      for k, v in tasks_frequency.items()]

    return jsonify({"throughput_histogram": histogram_data,
                    "status": "success"})


@app.route("/cumulativeFlowDiagram", methods=["POST"])
def cumulative_flow_diagram():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    project_id = request.json['projectId']
    sprint_id = request.json['sprintId']

    if sprint_id is None:
        return jsonify({"message": "No current sprint found"}), 404

    milestone_stats = get_milestone_stats(sprint_id, token)
    # date_format = "%Y-%m-%d"
    st_date = milestone_stats['estimated_start']
    fin_date = milestone_stats['estimated_finish']
    tasks = get_tasks(project_id, token)
    response_data = get_task_status_count_by_date(tasks, st_date, fin_date)

    formatted_and_cumulative_data = []
    cumulative_totals = {"new": 0, "inProgress": 0, "closed": 0}

    # Assuming each item in response_data is a dictionary with a 'date' key among others
    # And you want to sort this list by the 'date' key in each dictionary
    sorted_response_data = sorted(response_data, key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d'))

    for item in sorted_response_data:
        # Extract the date string from the item
        date_str = item['date']
        # Cumulate the counts
        for status in ["new", "inProgress", "closed"]:
            if status in item and status == "closed":
                cumulative_totals[status] += item[status]
            else:
                cumulative_totals[status] = item[status]
        
        data_entry = {
            "date": date_str,
            "new": cumulative_totals['new'],
            "inProgress": cumulative_totals['inProgress'],
            "closed": cumulative_totals['closed']
        }
        formatted_and_cumulative_data.append(data_entry)

    return jsonify({"data": formatted_and_cumulative_data, "status": "success"})


@app.route("/listUserProjects", methods=["GET"])
def user_project():
    auth_header = request.headers.get('Authorization')
    token = ''

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    project_info = get_project_by_user(token)

    if project_info is None:
        return jsonify({"status": "error", "message": "Project not found"})

    return jsonify({"data": project_info, "status": "success"})
  
  
@app.route("/BVBurndown", methods=["POST"])
def fetchBVBurndown():
    auth_header = request.headers.get('Authorization')
    token = ''

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401
    sprint_id = request.json['sprintId']
    project_id = request.json['projectId']
    if not sprint_id:
       return jsonify({"status": "error", "message": "SprintId required"})
    if not project_id:
         return jsonify({"status": "error", "message": "ProjectId required"})
    milestone_stats = get_milestone_stats(sprint_id, token)
    if milestone_stats is None:
        return jsonify({"message": "Error fetching milestone stats"}), 500
    custom_attributes = get_user_story_custom_attrib(project_id, token)

    if custom_attributes is None:
        return jsonify({"status": "error", "message": "Project not found"})
    BV_id = None
    for custom_attribute in custom_attributes:
        if custom_attribute['name'] == "BV" or custom_attribute['name'] == "Business Value":
            BV_id = custom_attribute['id']
            break
    if BV_id is None:
        return jsonify({"status": "error", "message": "BV not found"})
    
    BVBurnDownData = get_burndown_chart_metric_detail(sprint_id, BV_id, token)

    return  jsonify({"status": "success", "data":BVBurnDownData})
  
  
if __name__ == '__main__':
    app.run(debug=True, port=5000)