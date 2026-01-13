// Quick test to see what the API returns
const https = require('https');

const url = 'https://kick.com/api/v2/channels/sgsafsfsfsfsfs';

console.log('Testing API endpoint...\n');

https.get(url, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => data += chunk);
    
    res.on('end', () => {
        console.log('\n=== FULL RESPONSE ===');
        console.log(data);
        console.log('=== END RESPONSE ===\n');
        
        try {
            const json = JSON.parse(data);
            console.log('Parsed JSON keys:', Object.keys(json));
            
            if (json.playback_url) {
                console.log('✅ playback_url found:', json.playback_url.substring(0, 100) + '...');
            } else {
                console.log('❌ playback_url is:', json.playback_url);
                console.log('Full livestream object:', JSON.stringify(json.livestream, null, 2));
            }
        } catch (e) {
            console.log('Parse error:', e.message);
        }
    });
}).on('error', (err) => {
    console.log('Error:', err.message);
});
