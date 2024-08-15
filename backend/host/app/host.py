import os
import torch
from openvoice import se_extractor
from openvoice.api import BaseSpeakerTTS, ToneColorConverter

ckpt_base = 'checkpoints/base_speakers/EN'
ckpt_converter = 'checkpoints/converter'
device="cuda:0" if torch.cuda.is_available() else "cpu"
output_dir = 'outputs'

base_speaker_tts = BaseSpeakerTTS(f'{ckpt_base}/config.json', device=device)
base_speaker_tts.load_ckpt(f'{ckpt_base}/checkpoint.pth')

tone_color_converter = ToneColorConverter(f'{ckpt_converter}/config.json', device=device)
tone_color_converter.load_ckpt(f'{ckpt_converter}/checkpoint.pth')

os.makedirs(output_dir, exist_ok=True)

source_se = torch.load(f'{ckpt_base}/en_default_se.pth').to(device)

reference_speaker = 'resources/rem.mp3'
target_se, audio_name = se_extractor.get_se(reference_speaker, tone_color_converter, target_dir='processed', vad=True)


from datetime import datetime
def generateSound(message, style='cheerful'):
	current_datetime = datetime.now().strftime("%Y%m%d-%H%M%S")
	save_path = f'{output_dir}/output_en_{current_datetime}.wav'

	# Run the base speaker tts
	text = message
	src_path = f'{output_dir}/tmp.wav'
	base_speaker_tts.tts(text, src_path, speaker=style, language='English', speed=1)

	# Run the tone color converter
	encode_message = "@MyShell"
	tone_color_converter.convert(
	    audio_src_path=src_path, 
	    src_se=source_se, 
	    tgt_se=target_se, 
	    output_path=save_path,
	    message=encode_message)
	return save_path



from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os


app = Flask(__name__)
CORS(app)


@app.route('/frend-tts/outputs/<filename>')
def serve_image(filename):
	return send_from_directory('outputs', filename)

@app.route('/frend-tts/tts', methods=['POST'])
def process_text():
    data = request.get_json()
    if 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

    # Process the text here (e.g., echo it back)

    path = generateSound(data['text'],data['style'])	
    return jsonify({'file': path})


if __name__ == '__main__':
    app.run(port=6002, host="0.0.0.0")
