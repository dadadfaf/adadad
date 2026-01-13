const https = require('https');
const fs = require('fs');

const CHANNEL = 'sgsafsfsfsfsfs';
const API_URL = `https://kick.com/api/v2/channels/${CHANNEL}`;

function updateM3U8() {
    console.log(`🔄 Fetching: ${API_URL}`);
    
    https.get(API_URL, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                const m3u8Url = json.playback_url;
                
                if (m3u8Url) {
                    // Create the EXACT format you want
                    const content = `#EXTINF:-1,My first stream.\n${m3u8Url}`;
                    
                    fs.writeFileSync('index.m3u8', content);
                    console.log(`✅ Updated index.m3u8 with new URL`);
                    console.log(`📦 URL length: ${m3u8Url.length} characters`);
                    
                    // Also check if URL is different from previous
                    try {
                        const oldContent = fs.readFileSync('index.m3u8', 'utf8');
                        const lines = oldContent.split('\n');
                        const oldUrl = lines[1] || '';
                        
                        if (oldUrl === m3u8Url) {
                            console.log('🔁 URL is the same (no change)');
                        } else {
                            console.log('🔄 URL changed!');
                        }
                    } catch (e) {
                        console.log('📝 Created new file');
                    }
                    
                } else {
                    console.log('❌ No m3u8 URL found in response');
                }
                
            } catch (error) {
                console.log('❌ Error parsing JSON:', error.message);
            }
        });
        
    }).on('error', (error) => {
        console.log('❌ Network error:', error.message);
    });
}

// Run every 5 minutes (300000 ms)
updateM3U8();
setInterval(updateM3U8, 300000);

console.log('⏰ Updater started. Will check every 5 minutes.');
