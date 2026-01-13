const https = require('https');
const fs = require('fs');

const CHANNEL = 'sgsafsfsfsfsfs';
const API_URL = `https://kick.com/api/v2/channels/${CHANNEL}`;

function fetchKickAPI() {
    return new Promise((resolve, reject) => {
        console.log(`🔍 Fetching: ${API_URL}`);
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        };
        
        https.get(API_URL, options, (res) => {
            let data = '';
            
            // Check status code
            console.log(`📊 Status Code: ${res.statusCode}`);
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`📦 Response size: ${data.length} bytes`);
                
                if (data.length < 100) {
                    console.log('⚠️ Response too small:', data);
                }
                
                try {
                    const json = JSON.parse(data);
                    console.log('✅ JSON parsed successfully');
                    console.log('📋 Keys in response:', Object.keys(json));
                    
                    // Debug: Show the structure
                    if (json.playback_url === null) {
                        console.log('❌ playback_url is null in response');
                        console.log('💡 Available data:', {
                            id: json.id,
                            slug: json.slug,
                            is_live: json.livestream?.is_live,
                            has_livestream: !!json.livestream
                        });
                    }
                    
                    resolve(json);
                } catch (error) {
                    console.log('❌ JSON parse error:', error.message);
                    console.log('📄 Raw response (first 500 chars):', data.substring(0, 500));
                    reject(error);
                }
            });
            
        }).on('error', (error) => {
            console.log('❌ Network error:', error.message);
            reject(error);
        });
    });
}

async function updateM3U8() {
    try {
        const data = await fetchKickAPI();
        
        // Check for playback_url in different possible locations
        let m3u8Url = data.playback_url;
        
        console.log('🔎 Looking for m3u8 URL...');
        
        // If null, try alternative locations
        if (!m3u8Url) {
            console.log('🔄 Trying alternative locations...');
            
            // Try different possible paths
            m3u8Url = data.livestream?.playback_url || 
                      data.stream?.playback_url ||
                      data.livestream?.url ||
                      data.stream_url;
            
            console.log('Alternative check result:', m3u8Url || 'Not found');
        }
        
        // If still no URL, check if stream is live
        if (!m3u8Url && data.livestream?.is_live) {
            console.log('⚠️ Stream is LIVE but no URL found!');
            console.log('Livestream object:', JSON.stringify(data.livestream, null, 2));
        }
        
        // Create m3u8 content
        let content;
        if (m3u8Url && m3u8Url !== 'null') {
            content = `#EXTINF:-1,My first stream.\n${m3u8Url}`;
            console.log(`✅ Found URL: ${m3u8Url.substring(0, 80)}...`);
        } else {
            content = `#EXTINF:-1,My first stream.\n# Stream is offline or URL not available\n# Check: https://kick.com/${CHANNEL}`;
            console.log('❌ No m3u8 URL available');
        }
        
        // Write to file
        fs.writeFileSync('index.m3u8', content);
        console.log('📝 Updated index.m3u8');
        
        // Also save the full response for debugging
        fs.writeFileSync('debug_response.json', JSON.stringify(data, null, 2));
        console.log('📁 Saved debug_response.json');
        
    } catch (error) {
        console.log('❌ Failed to update:', error.message);
        
        // Create error m3u8
        const errorContent = `#EXTINF:-1,My first stream.\n# ERROR: ${error.message}\n# Time: ${new Date().toISOString()}`;
        fs.writeFileSync('index.m3u8', errorContent);
    }
}

// Run once
updateM3U8();

// Optional: Run every 5 minutes
// setInterval(updateM3U8, 300000);
