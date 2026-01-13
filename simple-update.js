const https = require('https');
const fs = require('fs');

const KICK_API = 'https://kick.com/api/v2/channels/sgsafsfsfsfsfs';
const M3U8_FILE = 'index.m3u8';

function updateM3U8() {
    console.log(`[${new Date().toLocaleTimeString()}] Updating...`);
    
    https.get(KICK_API, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                const m3u8Url = json.playback_url;
                const isLive = json.livestream?.is_live;
                const title = json.livestream?.session_title || 'Kick Stream';
                
                let m3u8 = '#EXTM3U\n';
                
                if (m3u8Url && isLive) {
                    m3u8 += `#EXTINF:-1,${title}\n`;
                    m3u8 += `${m3u8Url}\n`;
                    console.log('✅ Stream is LIVE');
                } else {
                    m3u8 += `#EXTINF:-1,${title} (OFFLINE)\n`;
                    m3u8 += '# https://kick.com/sgsafsfsfsfsfs\n';
                    console.log('⏸️ Stream is OFFLINE');
                }
                
                fs.writeFileSync(M3U8_FILE, m3u8);
                console.log(`📁 Updated: ${M3U8_FILE}`);
                
            } catch (error) {
                console.error('❌ Parse error:', error.message);
                fs.writeFileSync(M3U8_FILE, '#EXTM3U\n#EXTINF:-1,Error fetching stream\n');
            }
        });
        
    }).on('error', (error) => {
        console.error('❌ Fetch error:', error.message);
        fs.writeFileSync(M3U8_FILE, '#EXTM3U\n#EXTINF:-1,Connection Error\n');
    });
}

// Run every 5 minutes
updateM3U8();
setInterval(updateM3U8, 300000);
