#This is an example that uses the websockets api to know when a prompt execution is done
#Once the prompt execution is done it downloads the images using the /history endpoint

import websocket #NOTE: websocket-client (https://github.com/websocket-client/websocket-client)
import uuid
import json
import urllib.request
import urllib.parse

server_address = "127.0.0.1:8188"
client_id = str(uuid.uuid4())

def queue_prompt(prompt):
    p = {"prompt": prompt, "client_id": client_id}
    data = json.dumps(p).encode('utf-8')
    req =  urllib.request.Request("http://{}/prompt".format(server_address), data=data)
    return json.loads(urllib.request.urlopen(req).read())

def get_image(filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen("http://{}/view?{}".format(server_address, url_values)) as response:
        return response.read()

def get_history(prompt_id):
    with urllib.request.urlopen("http://{}/history/{}".format(server_address, prompt_id)) as response:
        return json.loads(response.read())

def get_images(ws, prompt):
    prompt_id = queue_prompt(prompt)['prompt_id']
    output_images = {}
    while True:
        out = ws.recv()
        if isinstance(out, str):
            message = json.loads(out)
            if message['type'] == 'executing':
                data = message['data']
                if data['node'] is None and data['prompt_id'] == prompt_id:
                    break #Execution is done
        else:
            continue #previews are binary data

    history = get_history(prompt_id)[prompt_id]
    for o in history['outputs']:
        for node_id in history['outputs']:
            node_output = history['outputs'][node_id]
            if 'images' in node_output:
                images_output = []
                for image in node_output['images']:
                    image_data = get_image(image['filename'], image['subfolder'], image['type'])
                    images_output.append(image_data)
            output_images[node_id] = images_output

    return output_images



import time
def getImageFromUserPrompt(userPrompt,style):
    with open('workflow_api.json','r', encoding='utf-8') as f:
            workflow_jsondata = f.read()

    prompt = json.loads(workflow_jsondata)

    #set the text prompt for our positive CLIPTextEncode
    prompt_text = userPrompt
    prompt_text += ", " + style + ", beautiful, master piece, vibrant, hi res"
    prompt["6"]["inputs"]["text"] =  prompt_text
    prompt["7"]["inputs"]["text"] =  "ugly, disfigured, extra limbs"
    #set the seed for our KSampler node
    seednum = 5
    prompt["3"]["inputs"]["seed"] = seednum

    ws = websocket.WebSocket()
    ws.connect("ws://{}/ws?clientId={}".format(server_address, client_id))
    images = get_images(ws, prompt)

    #Commented out code to display the output images:


    for node_id in images:
        for image_data in images[node_id]:
            from PIL import Image
            import io
            image = Image.open(io.BytesIO(image_data))
            current_timestamp = time.time()
            fileName = f"output/frend-ai-{seednum}-{node_id}-{current_timestamp}.png"
            image.save(fileName)
    return fileName

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
app= Flask(__name__)
CORS(app)

@app.errorhandler(400)
def bad_request(e):
    return jsonify(error=str(e)), 400


@app.route('/frend-draw/draw', methods=['POST'])
def draw():
    data = request.get_json()
    print('in draw')
    if 'prompt' not in data:
        print('prompt missing')
        return jsonify({'error':'No prompt'}), 400

    print(data)
    imageURL = getImageFromUserPrompt(data['prompt'],data['style'])
    return jsonify({'image':imageURL}), 200


@app.route('/frend-draw/output/<filename>')
def serve_image(filename):
    return send_from_directory('output', filename)


if __name__ == '__main__':
    app.run(port=6001,host="0.0.0.0")
