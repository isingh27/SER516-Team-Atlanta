from flask import Flask, jsonify, request
from taigaApi.authenticate import authenticate
from taigaApi.getProjectBySlug import get_project_by_slug, get_project_by_user
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/check", methods=["GET"])
def sampleRoute():
    response = jsonify({
        "message": "Authentication micro-service is up and running!"
    })
    return response


@app.route("/", methods=["POST"])
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

port = os.getenv("PORT")
if not port:
    port = 5001

if __name__ == '__main__':
    app.run(debug=True, port=int(port))