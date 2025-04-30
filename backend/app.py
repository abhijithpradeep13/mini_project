
from flask import Flask, request, jsonify,session 

from google import genai
from flask_cors import CORS
import os
import yt_dlp
from googleapiclient.discovery import build
from datetime import datetime

import whisper
from googletrans import Translator

from transformers import pipeline;

from dotenv import load_dotenv

load_dotenv()
API_KEY1 = os.getenv("API_KEY1")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


# Load Whisper model and Translator
model = whisper.load_model("base")
translator = Translator()


client = genai.Client(api_key=API_KEY1)  



app = Flask(__name__)
CORS(app)





# YouTube API credentials

youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

global_summarized_text = ""

global_summarized_file_path=""

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
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(output_path, f'%(title)s_{timestamp}.%(ext)s'),
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
        print(result["text"])
        global global_summarized_text  # Declare global variable
        global_summarized_text = result["text"]  # Store value globally
        with open(text_file_path, "w", encoding="utf-8") as f:
            f.write(result["text"])
           
        return text_file_path, result["text"]
        
    except Exception as e:
        return None, f"An error occurred during transcription: {e}"

# def translate_text(text, target_language):
#     # try:
#     #     translated = translator.translate(text, dest=target_language)
#     #     return translated.text
#     # except Exception as e:
#     #     return f"An error occurred during translation: {e}"
#     try:
#         if(target_language!='malayalam'):
#           translated = translator.translate(text, dest=target_language)
#           print('google trans resptonse ',translated.text)
#           return translated.text
#         else:
#           response = client.models.generate_content(
#           model='gemini-2.0-flash-exp',
#           contents=f"Translate the following text to {target_language} and return response in the specified language only: {text}"
#         )
#         #  Ensure the response is correctly extracted
#           if hasattr(response, 'text'):
#             print('gemini  resptonse ',response.text)
#             return response.text
#           else:
#             return "No summary generated."
    
#     except Exception as e:
#         return f"An error occurred during translation: {e}"


def translate_text(text, target_language):
    try:
        # Normalize target language to lowercase for comparison
        target_language_lower = target_language.lower()
        
        # Check if the target language is Malayalam
        if target_language_lower == 'malayalam' or target_language_lower == 'ml':
            # Use Gemini AI for Malayalam translation with the original model
            response = client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=f"Translate the following text to Malayalam and return the translation in Malayalam only:\n\n{text}"
            )
            
            # More robust response extraction
            try:
                # First try to extract text directly
                if hasattr(response, 'text'):
                    print('Gemini Malayalam Translation:', response.text)
                    return response.text
                
                # Fallback to candidates extraction
                elif hasattr(response, 'candidates') and response.candidates:
                    gemini_translation = response.candidates[0].content.parts[0].text
                    print('Gemini Malayalam Translation:', gemini_translation)
                    return gemini_translation
                
                else:
                    return "No translation generated by Gemini."
            
            except Exception as gemini_error:
                return f"Gemini translation error: {gemini_error}"
        
        else:
            # Use Google Translate for all other languages
            translated = translator.translate(text, dest=target_language)
            print(f'Google Translate {target_language} Response:', translated.text)
            return translated.text

    except Exception as e:
        return f"An error occurred during translation: {e}"

def summarize_text(text):
    # Generate the summary
    #summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    #return summary[0]['summary_text']
    
    try:
         response = client.models.generate_content(
         model='gemini-2.0-flash-exp',
         contents=f"Summarize the following text:\n\n{text}"
        )
        #  Ensure the response is correctly extracted
         if hasattr(response, 'text'):
            return response.text
         else:
            return "No summary generated."

    
    
    except Exception as e:
        return f"An error occurred during summarization: {e}"

def process_and_summarize_text(text_path, output_path):
    try:
        # Read the original extracted text
        with open(text_path, "r", encoding="utf-8") as file:
            extracted_text = file.read()
        
        # Summarize the extracted text
        summarized_text = summarize_text(extracted_text)
        

        print(summarized_text)
        
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
         'speech_text': transcription_text,
        
    }),201


@app.route('/api/notemaking', methods=['POST'])
def notemaking():
    prompt= request.json.get('prompt')
    output_path = request.json.get('path', 'C:\coding')
    video_url = request.json.get('url')
    print(1,video_url)
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
    global global_summarized_text  # Declare global variable
    global_summarized_text = transcription_text    # Store value globally

    global global_summarized_file_path  # Declare global variable
    summarized_file_path  = global_summarized_file_path   # Store value globally


    if not os.path.exists(output_path):
        os.makedirs(output_path)
    print(global_summarized_text)
    response2 = client.models.generate_content(
        model='gemini-2.0-flash-exp',
        contents=f"Identify the subject of the given content (e.g., Biology, Mathematics, Physics, Chemistry, etc.) and generate structured, point-wise notes by highlighting key concepts, definitions, and important points, converting text-based formulas into properly formatted mathematical expressions, and including relevant diagrams, equations, or reactions where necessary according to the provided text\n\n{transcription_text}"
       
    )

    formatted_text = response2.text.replace("\n", "<br>")  # Convert newlines to HTML <br>
    formatted_text = formatted_text.replace("*   ", "&nbsp;&nbsp;&nbsp;&nbsp;* ")  # Preserve bullet points and indentation
    aigentext=response2.text
    print("generated text -------",aigentext)
    

    # Store the translated text in a new file
    aigenerated_file_path = os.path.join(output_path, f"{os.path.basename(summarized_file_path)}_aigenerated.txt")
    with open(aigenerated_file_path, "w", encoding="utf-8") as f:
        f.write(aigentext)
        
   

    return jsonify({
        
         'gentext': formatted_text,
         'aigenerated_file_path':aigenerated_file_path,
         "transtext":global_summarized_text,
         'quiztoggle':'enabled',
         'pdfdata':response2.text
        
    }),201


@app.route('/api/quiz', methods=['POST'])
def quiz():
    
    output_path = request.json.get('path', 'C:\coding')
    transdata = request.json.get('transcriptionresult')
    

    if not os.path.exists(output_path):
        os.makedirs(output_path)

    
    quizinput = transdata    # Store value globally
    print("quizinput : "  ,quizinput)

    global global_summarized_file_path  # Declare global variable
    summarized_file_path = global_summarized_file_path

   

    if not os.path.exists(output_path):
        os.makedirs(output_path)
    print(quizinput)
    response2 = client.models.generate_content(
        model='gemini-2.0-flash-exp',
        contents=f"prepare multiple choice questions from the given content and return the mcqs  as an array of objects where object keys and their datatypes are id:integer,question:string,options:array of strings,correctAnswer:string .make sure you return only the array of objects and no other text \n\n{quizinput}"
    )
    
    
    aigentext=response2.text
    print("quiz:",aigentext)

    
    print(aigentext)

    # Store the translated text in a new file
    aigenerated_file_path = os.path.join(output_path, f"{os.path.basename(summarized_file_path)}_quiz.txt")
    with open(aigenerated_file_path, "w", encoding="utf-8") as f:
        f.write(aigentext)
        
   

    return jsonify({
        
         'quizresponse': aigentext,
         'aigenerated_file_path':aigenerated_file_path
        
    }),201



  

if __name__ == "__main__":
    app.run(debug=True)