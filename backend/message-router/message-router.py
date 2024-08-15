import lmdb
import os
import time
import sys
import signal

from queue import Queue

# Initialize the queue
chat_queue = Queue()

# Create a new LMDB environment
env = lmdb.open('chat_messages.lmdb', map_size=1024*1024*1024) # 1GB map size

from datetime import datetime, timedelta

# Dictionary to track the last time a user added a message
user_last_message_time = {}

def add_message_to_queue(user_id, message):
    now = datetime.now()
    if user_id in user_last_message_time and user_id not in admin_list:
        last_message_time = user_last_message_time[user_id]
        if now - last_message_time < timedelta(seconds=10):
            print(f"User {user_id} is rate-limited.")
            return False
    user_last_message_time[user_id] = now
    # Add the message to the queue
    # This is a placeholder for your actual queue logic
    chat_queue.put((user_id, message))

    print(f"Added message from user {user_id}: {message}")
    return True

def save_message_to_lmdb(user_id, message):
    with env.begin(write=True) as txn:
        key = f"{user_id}:{int(time.time())}".encode('utf-8')
        value = message.encode('utf-8')
        txn.put(key, value)

admin_list = ['danny@frend.ai'] # Example admin list

def process_chat_message(user_id, message):
    add_message_to_queue(user_id, message)
    save_message_to_lmdb(user_id, message)


from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/add_chat', methods=['POST'])
def add_chat():
    data = request.get_json()
    user_id = data.get('user_id')
    message = data.get('message')
    if not user_id or not message:
        return jsonify({"error": "Missing user_id or message"}), 400

    # Process the chat message
    process_chat_message(user_id, message)
    return jsonify({"message": "Chat message processed successfully"}), 200


@app.route('/get_next_message', methods=['GET'])
def get_next_message():
    if chat_queue.empty():
        return jsonify({"message": "No messages in the queue"}), 204
    user_id, message = chat_queue.get()
    return jsonify({"user_id": user_id, "message": message}), 200


import json
def deserialize_lmdb_to_queue(env, queue):
    with env.begin() as txn:
        cursor = txn.cursor()
        for key, value in cursor:
            try:
                user_id = key.decode('utf-8')
                message = value.decode('utf-8')
                queue.put((user_id, message))
            except json.decoder.JSONDecodeError:
                print(f"Error decoding JSON for key {user_id}: {value}")
            except Exception as e:
                print(f"Unexpected error: {e}")

    # Check if the queue is empty
    if queue.empty():
        print("Queue is empty.")
    else:
        print("Queue loaded successfully.")

# On application startup
deserialize_lmdb_to_queue(env, chat_queue)

@app.errorhandler(500)
def handle_500(error):
    # Backup queue to LMDB here
    print("Backing up queue to LMDB due to 500 error.")
    backup_queue_to_lmdb(chat_queue, env)
    return jsonify({"error": "Internal Server Error"}), 500

def backup_queue_and_exit(signal, frame):
    print("Backing up queue to LMDB due to keyboard interrupt.")
    backup_queue_to_lmdb(chat_queue, env)
    sys.exit(0)

def backup_queue_to_lmdb(queue, env):
    with env.begin(write=True) as txn:
        for item in list(queue.queue): # Convert queue to list to avoid RuntimeError
            key = str(item[0]).encode('utf-8') # Assuming user_id as the key
            value = json.dumps(item[1]).encode('utf-8') # Serialize message
            txn.put(key, value)
    print('Backing up queue')

# Register the signal handler for SIGINT (keyboard interrupt)
signal.signal(signal.SIGINT, backup_queue_and_exit)

if __name__ == '__main__':
    app.run(port=8888,host='0.0.0.0')
