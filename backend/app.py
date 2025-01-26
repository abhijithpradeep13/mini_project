from flask import Flask, request, jsonify,render_template, send_file
from flask_cors import CORS
import os
import yt_dlp
from googleapiclient.discovery import build

import whisper
from googletrans import Translator

from transformers import pipeline




# Load Whisper model and Translator
model = whisper.load_model("base")
translator = Translator()

# Summarization model setup
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")



app = Flask(__name__)
CORS(app)

# YouTube API credentials
YOUTUBE_API_KEY = 'AIzaSyARvhH0rIG4XPkZ2hsENx6cwMijkxuEvMA'  # Replace with your API key
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)



# Define the function to search for YouTube videos
def search_youtube(query, max_results=9):
    request = youtube.search().list(
        q=query,
        part="snippet",
        maxResults=max_results,
        type="video"
    )
    response = request.execute()

    video_info = []
    for item in response["items"]:
        video_info.append({
            "title": item["snippet"]["title"],
            "url": f'https://www.youtube.com/watch?v={item["id"]["videoId"]}',
            "thumbnail": item["snippet"]["thumbnails"]["default"]["url"]
        })

    return video_info

def download_audio(video_url, output_path="C:\coding"):
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(video_url, download=False)
            file_name = ydl.prepare_filename(info_dict)
            ydl.download([video_url])
        return file_name
    except Exception as e:
        return f"An error occurred: {e}"

def transcribe_audio(audio_path, output_path):
    try:
        print("errcheck0")
        result = model.transcribe(audio_path)
        print("errcheck1")
        text_file_path = os.path.join(output_path, f"{os.path.basename(audio_path)}.txt")
        print("errcheck2")
        with open(text_file_path, "w", encoding="utf-8") as f:
            f.write(result["text"])
           
        return text_file_path, result["text"]
        
    except Exception as e:
        return None, f"An error occurred during transcription: {e}"

def translate_text(text, target_language):
    try:
        translated = translator.translate(text, dest=target_language)
        return translated.text
    except Exception as e:
        return f"An error occurred during translation: {e}"

def summarize_text(text):
    # Generate the summary
    summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    return summary[0]['summary_text']

def process_and_summarize_text(text_path, output_path):
    try:
        # Read the original extracted text
        with open(text_path, "r", encoding="utf-8") as file:
            extracted_text = file.read()
        
        # Summarize the extracted text
        summarized_text = summarize_text(extracted_text)
        
        # Store the summarized text in a new file
        summarized_file_path = os.path.join(output_path, f"summary_{os.path.basename(text_path)}")
        with open(summarized_file_path, "w", encoding="utf-8") as summary_file:
            summary_file.write(summarized_text)
        
        return summarized_file_path, summarized_text
    
    except Exception as e:
        return None, f"An error occurred during summarization: {e}"
     


@app.route('/api/search', methods=['POST'])
def search():
    query = request.json.get("search")
    print(query)
    if not query:
        return jsonify({'message': 'No query provided'}),400

    # Fetch YouTube videos using the search_youtube function
    videos = search_youtube(query)
    print(videos)
    # Render the template and pass the video list
    return jsonify({'videos': videos})


@app.route('/api/process', methods=['POST'])
def process():
    video_url = request.json.get('url')
    print(1,video_url)
    output_path = request.json.get('path', 'C:\coding')
    user_language = request.json.get('lang')
    print(2,user_language)
    language_mapping = {
        "english": "en",
        "french": "fr",
        "spanish": "es",
        "german": "de",
        "chinese": "zh-cn",
        "hindi": "hi",
        "arabic": "ar",
        "malayalam": "ml",
    }

    target_language = language_mapping.get(user_language, "en")

    if not os.path.exists(output_path):
        os.makedirs(output_path)

    # Step 1: Download audio and transcribe
    audio_path = download_audio(video_url, output_path)
    if "An error occurred" in audio_path:
        return jsonify({'message': audio_path})
    
    print(3,video_url)

    transcription_path, transcription_text = transcribe_audio(audio_path, output_path)
    if transcription_path is None:
        return jsonify({'message': transcription_text})
    
    print(4,video_url)

    # Step 2: Summarize the transcribed text
    summarized_file_path, summarized_text = process_and_summarize_text(transcription_path, output_path)
    if summarized_file_path is None:
        return jsonify({'message': summarized_text})

    # Step 3: Translate the summarized text
    translated_text = translate_text(summarized_text, target_language)
    if "An error occurred" in translated_text:
        return jsonify({'message': translated_text})

    # Store the translated text in a new file
    translated_file_path = os.path.join(output_path, f"{os.path.basename(summarized_file_path)}_translated.txt")
    with open(translated_file_path, "w", encoding="utf-8") as f:
        f.write(translated_text)

    return jsonify({
        'message': "Audio downloaded, transcribed, summarized, and translated successfully.",
        'transcription_path': transcription_path,
        'summarized_path': summarized_file_path,
        'translated_path': translated_file_path,
         'translated_text': translated_text,
        
    }),201

@app.route('/download', methods=['GET'])
def download():
    file_path = request.args.get('path')
    if file_path and os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({'message': 'File not found'})

   




  

if __name__ == "__main__":
    app.run(debug=True)