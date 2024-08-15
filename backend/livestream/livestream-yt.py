import pytchat
import time
from collections import deque
import hashlib
import sys

readyForNext=False;

class ChatState:
    def __init__(self):
        self.chats = []
        self.user_cooldowns = {}
        self.user_queues = {}

    def add_chat(self, chat_id, status, user_id, message):
        self.chats.append({'chat_id': chat_id, 'status': status, 'user_id': user_id})
        # Initialize or reset the cooldown for the user
        self.user_cooldowns[user_id] = time.time()
        # Initialize or add to the queue for the user
        if user_id not in self.user_queues:
            self.user_queues[user_id] = deque()
        self.user_queues[user_id].append(message)

    def can_chat(self, user_id):
        # Check if the user is in cooldown
        if user_id in self.user_cooldowns:
            elapsed_time = time.time() - self.user_cooldowns[user_id]
            if elapsed_time < 10: # 10 seconds cooldown
                return False
        # If not in cooldown or cooldown has passed, allow the user to chat
        return True

    def release_next_message(self, user_id):
        if user_id in self.user_queues and len(self.user_queues[user_id]) > 0:
            # Release the next message from the queue
            return self.user_queues[user_id].popleft()
        return None

    def get_all_chats(self):
        return self.chats




def generate_user_id(user_name):
    # Create a new hash object
    hash_object = hashlib.sha256()
    # Update the hash object with the bytes of the user name
    hash_object.update(user_name.encode('utf-8'))
    # Get the hexadecimal representation of the hash
    user_id = hash_object.hexdigest()
    return user_id

import requests
url = 'http://localhost:8888/add_chat'

def getMessages():
    print('Chat is alive again')
    chatid=0
    while chat.is_alive():
        for c in chat.get().sync_items():
            chat_state.add_chat(video_id, 'active', c.author.name,c.message)
            print(f"{c.datetime} [{c.author.name}]- {c.message}")

            data = {"user_id": c.author.name, "message": c.message}
            response = requests.post(url, json=data)


# Enforce stream video id as argument
if len(sys.argv) < 2:
    print("You must add the stream Id as argument.")
    sys.exit(1)

video_id = sys.argv[1]
chat = pytchat.create(video_id)


chat_state = ChatState()
getMessages()
