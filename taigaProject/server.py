from flask import Flask, jsonify, request, make_response
from taigaApi.authenticate import authenticate
from taigaApi.project.getProjectBySlug import get_project_by_slug
from taigaApi.task.getTaskHistory import get_task_history
from taigaApi.task.getTasks import get_closed_tasks, get_all_tasks
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


if __name__ == '__main__':
    app.run(debug=True, port=5000)