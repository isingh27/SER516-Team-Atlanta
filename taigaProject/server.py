from flask import Flask, request
from taigaApi.authenticate import authenticate



app = Flask(__name__)

@app.route("/")
def sampleRoute():
    return {
        "message": "Hello, World!"
    }

@app.route("/authenticate", methods=["POST"])
def auth():
    username = request.json['username']
    password = (request.json['password'])
    print("username",username)
    print("pswd",password)
    auth_token = authenticate(username,password)
    print(auth_token)
    return auth_token

if __name__ == '__main__':
    app.run(debug=True, port=5000)
