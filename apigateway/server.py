from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Configuration for the microservices
MICROSERVICES = {
    'auth': 'http://localhost:5001',
    'cycleTime': 'http://localhost:5002',
    'leadTime': 'http://localhost:5003',
    'throughput': 'http://localhost:5004',
    'cumulativeFlowDiagram': 'http://localhost:5004',
    'wip': 'http://localhost:5005',
    'burndown': 'http://localhost:5006',
}

@app.route('/<service_name>/', defaults={'path': ''})
@app.route('/<service_name>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def gateway(service_name, path):
    if service_name not in MICROSERVICES:
        return jsonify({'error': 'Service not found'}), 404

    # Build the actual URL to forward the request to
    # Avoiding double slashes when concatenating
    service_base_url = MICROSERVICES[service_name].rstrip('/')
    service_url = f"{service_base_url}/{path.lstrip('/')}"
    if request.query_string:
        service_url += f"?{request.query_string.decode('utf-8')}"

    print(service_url)
    # Forward the request to the service and return the response
    response = requests.request(
        method=request.method,
        url=service_url,
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False)

    # Return the response received from the microservice
    return (response.content, response.status_code, response.headers.items())

if __name__ == '__main__':
    app.run(port=5000)