from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from taigaApi.impedimenttracker import get_project_impediments

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/check", methods=["GET"])
def sampleRoute():
    response = jsonify({
        "message": "Impediment Tracker micro-service is up and running!"
    })
    return response


@app.route("/", methods=["POST"])
def impediment():

    auth_header = request.headers.get('Authorization')
    token = ''

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401
    project_id = request.json['projectId']

    impediments = get_project_impediments(project_id, token)
    return jsonify(impediments)

port = os.getenv("PORT")
if not port:
    port = 5012

if __name__ == '__main__':
    app.run(debug=True, port=int(port))