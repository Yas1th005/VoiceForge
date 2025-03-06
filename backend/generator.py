from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the Gemini API with your key
API_KEY = "elo7Wi9ogWXtzIcuwEBhlLyw0u93"  # Replace with actual key in production
genai.configure(api_key=API_KEY)

@app.route('/api/generate', methods=['POST'])
def generate_script():
    data = request.json
    prompt = data.get('prompt', '')
    
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    try:
        # Initialize the model
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate content
        response = model.generate_content(prompt)
        
        # Return the generated content
        return jsonify({'result': response.text})
    
    except Exception as e:
        print(f"Error generating content: {str(e)}")
        return jsonify({'error': 'Failed to generate content'}), 500

# Serve React app in production
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True,port=5001)

