#!/bin/bash

# Simple bash script to update m3u8
API_URL="https://kick.com/api/v2/channels/sgsafsfsfsfsfs"

echo "🔄 Fetching from: $API_URL"

# Get JSON response
curl -s "$API_URL" > temp.json

# Extract m3u8 URL
M3U8_URL=$(jq -r '.playback_url' temp.json)

if [ "$M3U8_URL" != "null" ] && [ ! -z "$M3U8_URL" ]; then
    # Create index.m3u8
    echo "#EXTINF:-1,My first stream." > index.m3u8
    echo "$M3U8_URL" >> index.m3u8
    
    echo "✅ Updated index.m3u8"
    echo "📊 URL: ${M3U8_URL:0:50}..."
    echo "📏 Length: ${#M3U8_URL} chars"
else
    echo "❌ Failed to get m3u8 URL"
fi

# Clean up
rm temp.json
