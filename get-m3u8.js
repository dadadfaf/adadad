const https = require('https');
const fs = require('fs');

// Your Kick channel
const CHANNEL = 'sgsafsfsfsfsfs';
const API_URL = `https://kick.com/api/v2/channels/${CHANNEL}`;
const OUTPUT_FILE = 'index.m3u8';

function fetchStream() {
    console.log(`[${new Date().toLocaleTimeString()}] Fetching from: ${API_URL}`);
    
    return new Promise((resolve, reject) => {
        https.get(API_URL, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    
                    // Check if playback_url exists
                    if (json.playback_url) {
                        const m3u8Url = json.playback_url;
                        const isLive = json.livestream?.is_live || false;
                        const title = json.livestream?.session_title || `${CHANNEL}'s Stream`;
                        const viewers = json.livestream?.viewer_count || 0;
                        
                        console.log('✅ SUCCESS!');
                        console.log(`   Title: ${title}`);
                        console.log(`   Status: ${isLive ? 'LIVE' : 'OFFLINE'}`);
                        console.log(`   Viewers: ${viewers}`);
                        console.log(`   M3U8 URL found (length: ${m3u8Url.length} chars)`);
                        
                        resolve({
                            success: true,
                            m3u8Url: m3u8Url,
                            title: title,
                            isLive: isLive,
                            viewers: viewers
                        });
                    } else {
                        console.log('❌ No playback_url found in response');
                        resolve({
                            success: false,
                            error: 'No playback_url in API response'
                        });
                    }
                    
                } catch (error) {
                    console.log('❌ JSON Parse Error:', error.message);
                    resolve({
                        success: false,
                        error: 'Failed to parse JSON'
                    });
                }
            });
            
        }).on('error', (error) => {
            console.log('❌ Network Error:', error.message);
            resolve({
                success: false,
                error: 'Network error'
            });
        });
    });
}

function createM3U8(streamData) {
    const timestamp = new Date().toISOString();
    
    if (streamData.success && streamData.m3u8Url) {
        // Create working m3u8 with the actual stream URL
        const content = `#EXTM3U
# Generated: ${timestamp}
# Channel: ${CHANNEL}
# Status: ${streamData.isLive ? 'LIVE' : 'OFFLINE'}
# Title: ${streamData.title}
# Viewers: ${streamData.viewers}
# Next Update: ${new Date(Date.now() + 5 * 60000).toISOString()}

#EXTINF:-1,${streamData.title}
${streamData.m3u8Url}`;
        
        fs.writeFileSync(OUTPUT_FILE, content);
        console.log(`✅ Updated ${OUTPUT_FILE} with LIVE stream URL`);
        
        // Also create a test file with just the URL
        fs.writeFileSync('stream-url.txt', streamData.m3u8Url);
        
    } else {
        // Create error m3u8
        const content = `#EXTM3U
# Generated: ${timestamp}
# Status: ERROR - ${streamData.error || 'Unknown error'}
# Channel: ${CHANNEL}
# Next Update: ${new Date(Date.now() + 5 * 60000).toISOString()}

#EXTINF:-1,${CHANNEL} - Stream Offline/Error
# https://kick.com/${CHANNEL}
# Check logs for details`;
        
        fs.writeFileSync(OUTPUT_FILE, content);
        console.log(`❌ Created error m3u8: ${streamData.error}`);
    }
}

async function update() {
    const streamData = await fetchStream();
    createM3U8(streamData);
}

// Run immediately
update();

// Then run every 5 minutes
setInterval(update, 5 * 60 * 1000);
