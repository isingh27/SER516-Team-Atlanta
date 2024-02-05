from flask import Flask, jsonify, request
from taigaApi.authenticate import authenticate
from taigaApi.project.getProjectBySlug import get_project_by_slug



app = Flask(__name__)

@app.route("/authenticate", methods=["POST"])
def auth():
    username = request.json['username']
    password = (request.json['password'])
    auth_token = authenticate(username,password)
    print(auth_token)
    return auth_token

@app.route("/projectDetails", methods=["POST"])
def projectDetails():
    # Extract the token from the Authorization header
    auth_header = request.headers.get('Authorization')
    token=''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401

    projectSlug= request.json['projectSlug']
    project_info = get_project_by_slug(projectSlug,token)
    return project_info

if __name__ == '__main__':
    app.run(debug=True, port=5000)
