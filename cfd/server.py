from flask import Flask, jsonify, request
from taigaApi.getMilestoneStats import get_milestone_stats
from taigaApi.getTasks import get_tasks
from taigaApi.getTaskStatus import get_task_status_count_by_date
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# @app.route("/")
# def sampleRoute():
#     response = jsonify({
#         "message": "Cumulative Flow Diagram Microservice is up and running!"
#     })
#     return response

@app.route("/", methods=["POST"])
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

port = os.getenv("PORT")
if not port:
    port = 5001

if __name__ == '__main__':
    app.run(debug=True, port=int(port))