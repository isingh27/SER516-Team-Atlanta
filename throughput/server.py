from flask import Flask, jsonify, request
from taigaApi.getTasks import get_closed_tasks
from taigaApi.getMilestoneStats import get_milestone_stats
from flask_cors import CORS
from datetime import datetime, timedelta
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
            tasks_completed_per_day[finished_date] = tasks_completed_per_day.get(finished_date, 0) + 1

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
                tasks_completed_per_day[finished_date] = tasks_completed_per_day.get(finished_date, 0)+ 1

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


port = os.getenv("PORT")
if not port:
    port = 5004

if __name__ == '__main__':
    app.run(debug=True, port=int(port))