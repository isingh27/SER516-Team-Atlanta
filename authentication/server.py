from flask import Flask, jsonify, request
from taigaApi.authenticate import authenticate
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

port = os.getenv("PORT")
if not port:
    port = 5001

if __name__ == '__main__':
    app.run(debug=True, port=int(port))