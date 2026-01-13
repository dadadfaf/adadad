const fs = require('fs');

// This does ONE thing: fetches URL and writes it
async function getAndWrite() {
    try {
        // Fetch from Kick API
        const response = await fetch('https://kick.com/api/v2/channels/sgsafsfsfsfsfs');
        const data = await response.json();
        
        // Get the m3u8 URL
        const m3u8Url = data.playback_url;
        
        // Write EXACTLY what you want
        const content = `#EXTINF:-1,My first stream.\n${m3u8Url}`;
        fs.writeFileSync('index.m3u8', content);
        
        console.log('✅ Updated! Time:', new Date().toLocaleTimeString());
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

// Run now and every 5 minutes
getAndWrite();
setInterval(getAndWrite, 300000);
