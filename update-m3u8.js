const axios = require('axios');
const fs = require('fs');

// Your specific Kick channel API URL
const KICK_API_URL = 'https://kick.com/api/v2/channels/sgsafsfsfsfsfs';
const M3U8_FILE = 'index.m3u8';

async function fetchAndUpdateM3U8() {
    try {
        console.log(`🔄 Fetching from: ${KICK_API_URL}`);
        
        // Fetch data from Kick API
        const response = await axios.get(KICK_API_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const data = response.data;
        
        // Extract m3u8 URL from the API response
        const m3u8Url = data.playback_url;
        const isLive = data.livestream?.is_live || false;
        const streamTitle = data.livestream?.session_title || 'Kick Stream';
        const viewers = data.livestream?.viewer_count || 0;
        
        console.log(`✅ Stream Status: ${isLive ? 'LIVE' : 'OFFLINE'}`);
        console.log(`📺 Title: ${streamTitle}`);
        console.log(`👀 Viewers: ${viewers}`);
        console.log(`🔗 M3U8 URL: ${m3u8Url || 'No URL'}`);
        
        // Create M3U8 content
        let m3u8Content = `#EXTM3U
# Generated: ${new Date().toISOString()}
# Channel: sgsafsfsfsfsfs
# Status: ${isLive ? 'LIVE' : 'OFFLINE'}
# Title: ${streamTitle}
# Viewers: ${viewers}
# Update Interval: 5 minutes
# Next Update: ${new Date(Date.now() + 5 * 60000).toISOString()}
\n`;
        
        if (m3u8Url && isLive) {
            // Add the actual stream
            m3u8Content += `#EXTINF:-1,${streamTitle}\n`;
            m3u8Content += `${m3u8Url}\n`;
        } else {
            // Add placeholder if offline
            m3u8Content += `#EXTINF:-1,${streamTitle} (OFFLINE)\n`;
            m3u8Content += `# https://kick.com/sgsafsfsfsfsfs\n`;
        }
        
        // Write to file
        fs.writeFileSync(M3U8_FILE, m3u8Content);
        console.log(`✅ Updated ${M3U8_FILE} at ${new Date().toLocaleTimeString()}`);
        
        // Also save to a backup file with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.writeFileSync(`backup/m3u8-${timestamp}.txt`, m3u8Content);
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        
        // Create error M3U8
        const errorContent = `#EXTM3U
# ERROR: Failed to fetch stream
# Time: ${new Date().toISOString()}
# Error: ${error.message}
#EXTINF:-1,Kick Stream Error
# Check console for details\n`;
        
        fs.writeFileSync(M3U8_FILE, errorContent);
    }
}

// Run immediately and then every 5 minutes
fetchAndUpdateM3U8();
setInterval(fetchAndUpdateM3U8, 5 * 60 * 1000); // 5 minutes
