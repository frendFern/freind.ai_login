import argparse
import requests
import json

# Create the parser
parser = argparse.ArgumentParser(description="Test chat message API")

# Add arguments
parser.add_argument("-m", "--method", choices=["post", "get"], required=True, help="HTTP method to use")
parser.add_argument("-u", "--url", required=True, help="URL of the API endpoint")
parser.add_argument("-d", "--data", nargs="*", help="Data to send with POST request in format: user_id message")

# Parse arguments
args = parser.parse_args()

if args.method == "post":
    if args.data:
        user_id, message = args.data
        data = {"user_id": user_id, "message": message}
        response = requests.post(args.url, json=data)
    else:
        print("Error: POST method requires data.")
        exit(1)
elif args.method == "get":
    try:
        response = requests.get(args.url)
        if response.content:
            print(response.json())
        else:
            print('No content')
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

