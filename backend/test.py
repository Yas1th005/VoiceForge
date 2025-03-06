import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import requests
from pyht import Client
from pyht.client import TTSOptions
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# API credentials
USER_ID = "6kkNFid2p3hRAEE7iJkKIFLBCuz2"
API_KEY = "b73c1078d0494464b78d1e49d12259b6"

# Step 1: Clone a voice from an audio sample
def clone_voice(sample_file_path, voice_name):
    url = "https://api.play.ht/api/v2/cloned-voices/instant"
    
    with open(sample_file_path, "rb") as f:
        files = {
            "sample_file": (os.path.basename(sample_file_path), f, "audio/mpeg")
        }
        
        payload = {"voice_name": voice_name}
        
        headers = {
            "accept": "application/json",
            "AUTHORIZATION": API_KEY,
            "X-USER-ID": USER_ID
        }
        
        response = requests.post(url, files=files, data=payload, headers=headers)
        return response.json()

# Step 2: Generate TTS using the cloned voice
# def generate_tts(voice_id, text_to_speak, output_file):
#     client = Client(
#         user_id=USER_ID,
#         api_key=API_KEY,
#     )
    
#     options = TTSOptions(voice=voice_id)
    
#     # Open a file to save the audio
#     with open(output_file, "wb") as audio_file:
#         for chunk in client.tts(text_to_speak, options, voice_engine='PlayDialog', protocol='http'):
#             # Write the audio chunk to the file
#             audio_file.write(chunk)
    
#     return output_file


def generate_tts(voice_id, text_to_speak, output_file, payload_options=None):
    url = "https://api.play.ht/api/v2/tts/stream"
    
    # Extract the output format from the output_file path
    output_format = output_file.split('.')[-1]
    
    # Base payload with required parameters
    payload = {
        "voice": voice_id,
        "text": text_to_speak,
        "voice_engine": "PlayDialog",
        "output_format": output_format
    }
    
    # If additional payload options are provided from frontend, update the payload
    if payload_options and isinstance(payload_options, dict):
        payload.update(payload_options)
    
    headers = {
        "content-type": "application/json",
        "AUTHORIZATION": API_KEY,
        "X-USER-ID": USER_ID
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    # Check if response is successful
    if response.status_code == 200:
        # Ensure output file has correct extension
        if "output_format" in payload and not output_file.endswith(f".{payload['output_format']}"):
            output_file = f"{os.path.splitext(output_file)[0]}.{payload['output_format']}"
            
        with open(output_file, "wb") as f:
            f.write(response.content)
        return output_file
    else:
        raise Exception(f"Error generating TTS: {response.status_code} - {response.text}")

@app.route('/api/clone-and-generate', methods=['POST'])
def clone_and_generate():
    if 'sample_file' not in request.files:
        return jsonify({'error': 'No sample_file part'}), 400
    
    sample_file = request.files['sample_file']
    voice_name = request.form.get('voice_name', 'Voice Clone')
    message = request.form.get('message', '')
    
    # Default output format (can be overridden by frontend payload)
    output_format = request.form.get('output_format', 'mp3')
    
    # Get additional TTS payload options from frontend
    # These could include: emotion, language, etc.
    tts_options = {}
    for key in request.form:
        if key not in ['voice_name', 'message', 'output_format'] and key != 'sample_file':
            tts_options[key] = request.form.get(key)
    
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Create unique filename for the uploaded sample
    unique_id = str(uuid.uuid4())
    sample_filename = secure_filename(f"{unique_id}_{sample_file.filename}")
    sample_path = os.path.join(UPLOAD_FOLDER, sample_filename)
    
    # Save the uploaded sample
    sample_file.save(sample_path)
    
    try:
        # Clone the voice
        clone_result = clone_voice(sample_path, voice_name)
        
        if 'id' not in clone_result:
            return jsonify({'error': 'Failed to clone voice', 'details': clone_result}), 500
        
        voice_id = clone_result['id']
        print(f"Voice cloned with ID: {voice_id}")
        
        # Generate TTS with the cloned voice
        output_filename = f"{unique_id}_output.{output_format}"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        
        # Pass tts_options to generate_tts
        output_path = generate_tts(voice_id, message, output_path, tts_options)
        
        # Extract the actual filename in case it was modified
        actual_filename = os.path.basename(output_path)
        
        # Return the URL to the generated audio
        audio_url = f"/api/audio/{actual_filename}"
        print(f"'voice_id': {voice_id}, \n'audio_url': {audio_url}, \n'format': {output_format}, \n'applied_options': {tts_options}")


        return jsonify({
            'success': True, 
            'voice_id': voice_id, 
            'audio_url': audio_url,
            'format': output_format,
            'applied_options': tts_options
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @app.route('/api/clone-and-generate', methods=['POST'])
# def clone_and_generate():
#     if 'sample_file' not in request.files:
#         return jsonify({'error': 'No sample_file part'}), 400
    
#     sample_file = request.files['sample_file']
#     voice_name = request.form.get('voice_name', 'Voice Clone')
#     message = request.form.get('message', '')
    
#     if not message:
#         return jsonify({'error': 'No message provided'}), 400
    
#     # Create unique filename for the uploaded sample
#     unique_id = str(uuid.uuid4())
#     sample_filename = secure_filename(f"{unique_id}_{sample_file.filename}")
#     sample_path = os.path.join(UPLOAD_FOLDER, sample_filename)
    
#     # Save the uploaded sample
#     sample_file.save(sample_path)
    
#     try:
#         # Clone the voice
#         clone_result = clone_voice(sample_path, voice_name)
        
#         if 'id' not in clone_result:
#             return jsonify({'error': 'Failed to clone voice', 'details': clone_result}), 500
        
#         voice_id = clone_result['id']
#         print(voice_id)
#         # Generate TTS with the cloned voice
#         output_filename = f"{unique_id}_output.wav"
#         output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        
#         generate_tts(voice_id, message, output_path)
        
#         # Return the URL to the generated audio
#         audio_url = f"/api/audio/{output_filename}"
#         return jsonify({'success': True, 'voice_id': voice_id, 'audio_url': audio_url})
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/api/audio/<filename>')
def get_audio(filename):
    return send_file(os.path.join(OUTPUT_FOLDER, filename))

# Add a simple test route
@app.route('/')
def index():
    return jsonify({"status": "API is running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')