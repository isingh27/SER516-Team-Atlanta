from flask import Flask, jsonify, request, make_response
from taigaApi.authenticate import authenticate
from taigaApi.project.getProjectBySlug import get_project_by_slug
from taigaApi.task.getTaskHistory import get_task_history, get_task_cycle_times, get_user_story_cycle_times
from taigaApi.task.getTasks import get_closed_tasks, get_closed_user_stories
from taigaApi.sprint.getCurrentSprintID import get_current_sprint_id
from taigaApi.sprint.getMilestoneStats import get_milestone_stats
from flask_cors import CORS
from datetime import datetime, timedelta

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
    print("username",username)
    print("pswd",password)
    auth_token = authenticate(username,password)
    print(auth_token)
    return jsonify({"token": auth_token, "status": "success"})

@app.route("/projectDetails", methods=["POST"])
def projectDetails():
    auth_header = request.headers.get('Authorization')
    token=''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401
    
    projectSlug= request.json['projectSlug']
    project_info = get_project_by_slug(projectSlug,token)
    if project_info == None:
        return jsonify({"status": "error", "message": "Project not found"})
    return jsonify({"data":project_info, "status": "success"})


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
        return jsonify({"message": "No closed tasks found in the project"}), 404
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
        output.append({"task":task,"finished_date":finished_date,"lead_time":lead_time})
    return jsonify({"plotData":output, "status":"success"})

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
        return jsonify({"message": "No closed tasks found in the project"}), 404

    cycle_times = get_task_cycle_times(closed_tasks, token)

    response_data = []
    for cycle_time, start_date, end_date in cycle_times:
        response_data.append({
            "cycle_time": cycle_time,
            "start_date": start_date,
            "end_date": end_date
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

    if not closed_user_stories:  # Check if the list of closed user stories is empty
        return jsonify({"message": "No closed user stories found in the project"}), 404
    
    cycle_times = get_user_story_cycle_times(closed_user_stories, token)

    response_data = []
    for cycle_time, start_date, end_date in cycle_times:
        response_data.append({
            "cycle_time": cycle_time,
            "start_date": start_date,
            "end_date": end_date
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

    project_id = request.json['projectId']

    # Call the function to get the current sprint ID
    sprint_id = get_current_sprint_id(project_id, token)

    if sprint_id is None:
        return jsonify({"message": "No current sprint found"}), 404

    # Call the function to get milestone stats using the sprint ID
    milestone_stats = get_milestone_stats(sprint_id, token)

    if milestone_stats is None:
        return jsonify({"message": "Error fetching milestone stats"}), 500

    # Add an "id" field to each item in the "days" list starting with 1
    for index, day_data in enumerate(milestone_stats["days"], start=1):
        day_data["id"] = index

    # Modify the response to only include the necessary fields
    response_data = {
        "days": milestone_stats["days"],
        "name": milestone_stats["name"],
        "total_points": milestone_stats["total_points"]
    }

    return jsonify({"burndown_chart_data": response_data, "status": "success"})






if __name__ == '__main__':
    app.run(debug=True, port=5000)