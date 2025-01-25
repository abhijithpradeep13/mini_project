import yt_dlp

def download_audio(video_url, output_path="downloads"):
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': f'{output_path}/%(title)s.%(ext)s',
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])
        print("Download completed.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    download_audio('https://www.youtube.com/watch?v=WIZw3hWlO9c&pp=ygUPMzAgbWludXRlIHZpZGVv', r'C:\\Users\\BOSS1\\OneDrive\\Desktop\\mini-project')