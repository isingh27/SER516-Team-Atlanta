from flask import Flask, jsonify, request, make_response
from taigaApi.authenticate import authenticate
from taigaApi.project.getProjectBySlug import get_project_by_slug



app = Flask(__name__)

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/")
def sampleRoute():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    else:
        response = _corsify_actual_response(jsonify({
            "message": "Hello, World!"
        }))
        return response

@app.route("/authenticate", methods=["POST", "OPTIONS"])
def auth():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    username = request.json['username']
    password = (request.json['password'])
    print("username",username)
    print("pswd",password)
    auth_token = authenticate(username,password)
    print(auth_token)
    return _corsify_actual_response(jsonify({"token": auth_token, "status": "success"}))

@app.route("/projectDetails", methods=["POST", "OPTIONS"])
def projectDetails():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    # Extract the token from the Authorization header
    auth_header = request.headers.get('Authorization')
    token=''
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
    else:
        return jsonify({"message": "Token is missing or invalid"}), 401
    
    projectSlug= request.json['projectSlug']
    project_info = get_project_by_slug(projectSlug,token)
    if project_info == None:
        return _corsify_actual_response(jsonify({"status": "error", "message": "Project not found"}))
    return _corsify_actual_response(jsonify({"data":project_info, "status": "success"}))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
