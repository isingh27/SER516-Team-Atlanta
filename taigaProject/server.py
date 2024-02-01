from flask import Flask

app = Flask(__name__)

@app.route("/")
def sampleRoute():
    return {
        "message": "Hello, World!"
    }