from flask import Flask, jsonify, request
from taigaApi.getMilestoneStats import get_milestone_stats
from taigaApi.getUserStory import get_user_story_custom_attrib
from taigaApi.getUserStory import get_burndown_chart_metric_detail,get_userstory_custom_attribute_burndown_for_sprint,get_storypoint_burndown_for_sprint
from taigaApi.getAllSprintIDs import get_all_sprint_ids
from flask_cors import CORS
from dotenv import load_dotenv
import os


load_dotenv()

app = Flask(__name__)
CORS(app)

# @app.route("/")
# def sampleRoute():
#     response = jsonify({
#         "message": "Burndown Microservice is up and running!"
#     })
#     return response


@app.route("/chart", methods=["POST"])
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


@app.route("/total", methods=["POST"])
def fetchTotalBurndown():
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
    
    totalBurnDownData = get_storypoint_burndown_for_sprint(sprint_id, token)


    return  jsonify({"status": "success", "data":totalBurnDownData})

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

@app.route("/bv", methods=["POST"])
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
    # milestone_stats = get_milestone_stats(sprint_id, token)
    # if milestone_stats is None:
    #     return jsonify({"message": "Error fetching milestone stats"}), 500
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
    
    # BVBurnDownData = get_burndown_chart_metric_detail(sprint_id, BV_id, token)
    BVBurnDownData = get_userstory_custom_attribute_burndown_for_sprint(project_id, sprint_id, token, "BV")

    return  jsonify({"status": "success", "data":BVBurnDownData})


port = os.getenv("PORT")
if not port:
    port = 5005

if __name__ == '__main__':
    app.run(debug=True, port=int(port))