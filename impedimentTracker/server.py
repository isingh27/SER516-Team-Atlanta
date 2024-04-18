from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from taigaApi import get_project_impediments

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
def impediment():
    project_id = request.json['project_id']
    auth_token = request.json['auth_token']
    impediments = get_project_impediments(project_id, auth_token)
    return jsonify(impediments)

port = os.getenv("PORT")
if not port:
    port = 5009

if __name__ == '__main__':
    app.run(debug=True, port=int(port))