from flask import Flask, jsonify, request
from taigaApi.getTasks import get_closed_tasks
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/")
def sampleRoute():
    response = jsonify({
        "message": "Lead Time micro-service is up and running!"
    })
    return response


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

@app.route("/leadTimeByRange", methods=["POST"])
def lead_time_range():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401
    # Send project Id as a parameter in JSON format.
    project_id = request.json['projectId']
    start_date = datetime.fromisoformat(request.json['startDate']).replace(tzinfo=None)
    end_date = datetime.fromisoformat(request.json['endDate']).replace(tzinfo=None)
    if start_date is None or end_date is None:
        return jsonify({"message": "Start date or End date is missing"}), 401
    tasks = get_closed_tasks(project_id, token)
    output = []
    for task in tasks:
        created_date = datetime.fromisoformat(task["created_date"]).replace(tzinfo=None)
        finished_date = datetime.fromisoformat(task['finished_date']).replace(tzinfo=None)
        if start_date <= created_date <= end_date or start_date <= finished_date <= end_date:
            lead_time = (finished_date - created_date).days
            output.append({"task": task, "finished_date": finished_date,
                       "lead_time": lead_time, "refId": task['ref']})
    if len(output) == 0:
        return jsonify({"message": "No tasks found in the given range"}), 404
    return jsonify({"plotData": output, "status": "success"})

port = os.getenv("PORT")
if not port:
    port = 5003

if __name__ == '__main__':
    app.run(debug=True, port=int(port))