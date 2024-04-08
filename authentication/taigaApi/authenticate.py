import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()


# Function to authenticate with the Taiga API using provided credentials
def authenticate(username, password):
    taiga_url = os.getenv('TAIGA_URL')
    payload = {
        "type": "normal",
        "username": username,
        "password": password,
    }

    try:
        # Make a POST request to Taiga API for authentication
        response = requests.post(f"{taiga_url}/auth", json=payload)
        response.raise_for_status()

        # Extract and return the authentication token from the response
        auth_token = response.json().get("auth_token")
        return auth_token

    except requests.exceptions.RequestException as e:
        # Handle authentication failure and print an error message
        print(f"Authentication failed: {e}")
        return None
