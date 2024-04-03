from flask import Flask, jsonify, request
from taigaApi.getTaskHistory import (
    get_task_history,
    get_task_cycle_times,
    get_user_story_cycle_times)
from taigaApi.getTasks import get_closed_tasks, get_closed_user_stories
from flask_cors import CORS
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv('MONGO_URL'), server_api=ServerApi('1'),tls=True, tlsAllowInvalidCertificates=True)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@app.route("/")
def sampleRoute():
    response = jsonify({
        "message": "CycleTime Microservice is up and running!"
    })
    return response

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


@app.route("/cycleTimesPerTask", methods=["POST"])
def cycle_time_per_task():
    
    db = client.taiga
    project_id = request.json['projectId']
    project = db.projects.find_one({"projectId": project_id})
    if project:
        return jsonify({"data": project["cycleTimesPerTask"], "status": "success"})
    else:
        auth_header = request.headers.get('Authorization')
        token = ''
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
        else:
            return jsonify({"message": "Token is missing or invalid"}), 401

        closed_tasks = get_closed_tasks(project_id, token)

        if not closed_tasks:
            return jsonify({"message": "No closed tasks found"}), 404
        cycle_times = []
        with ThreadPoolExecutor(max_workers=20) as executor:
            cycle_times = executor.submit(get_task_cycle_times, closed_tasks, token).result()

        response_data = []
        for cycle_time, start_date, end_date, ref in cycle_times:
            response_data.append({
                "cycle_time": cycle_time,
                "start_date": start_date,
                "end_date": end_date,
                "refId": ref   # refId is the task id
            })

        # Store the data in the database
        db.projects.insert_one({"projectId": project_id, "cycleTimesPerTask": response_data, "created_at": datetime.now()})
        return jsonify({"data": response_data, "status": "success"})


@app.route("/cycleTimesPerUserStory", methods=["POST"])
def cycle_time_per_user_story():
    db = client.taiga
    project_id = request.json['projectId']
    project = db.user_stories.find_one({"projectId": project_id})
    if project and 'cycleTimesPerUserStory' in project:
        return jsonify({"data": project['cycleTimesPerUserStory'], "status": "success"})

    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

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

    db.user_stories.insert_one({"projectId": project_id, "cycleTimesPerUserStory": response_data, "created_at": datetime.now()})
    
    return jsonify({"data": response_data, "status": "success"})

port = os.getenv("PORT")
if not port:
    port = 5001

if __name__ == '__main__':
    app.run(debug=True, port=int(port))