from flask import Flask, jsonify, request
from taigaApi.task.getTaskStatus import get_task_status, get_task_status_count_by_date

from taigaApi.sprint.getAllSprintIDs import get_all_sprint_ids
from flask_cors import CORS
from datetime import date, datetime, timedelta
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv('MONGO_URL'), server_api=ServerApi('1'),tls=True, tlsAllowInvalidCertificates=True)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# @app.route("/")
# def sampleRoute():
#     response = jsonify({
#         "message": "Hello, World!"
#     })
#     return response



@app.route("/", methods=["POST"])
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

port = os.getenv("PORT")
if not port:
    port = 5001

if __name__ == '__main__':
    app.run(debug=True, port=int(port))