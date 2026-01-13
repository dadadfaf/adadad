import requests
import time
from datetime import datetime

def update_m3u8():
    url = "https://kick.com/api/v2/channels/sgsafsfsfsfsfs"
    
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        
        m3u8_url = data.get('playback_url')
        
        if m3u8_url:
            # Write exactly what you want
            with open('index.m3u8', 'w') as f:
                f.write("#EXTINF:-1,My first stream.\n")
                f.write(f"{m3u8_url}\n")
            
            print(f"✅ Updated at {datetime.now().strftime('%H:%M:%S')}")
            print(f"🔗 URL: {m3u8_url[:50]}...")
        else:
            print("❌ No m3u8 URL found")
            
    except Exception as e:
        print(f"❌ Error: {e}")

# Run every 5 minutes
if __name__ == "__main__":
    while True:
        update_m3u8()
        time.sleep(300)  # 5 minutes
