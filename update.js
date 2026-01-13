const fs = require('fs');

// DIRECT URL from your API response (copy-pasted from your JSON)
const M3U8_URL = "https://fa723fc1b171.us-west-2.playback.live-video.net/api/video/v1/us-west-2.196233775518.channel.muWiEPi88enM.m3u8?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzM4NCJ9.eyJhd3M6Y2hhbm5lbC1hcm4iOiJhcm46YXdzOml2czp1cy13ZXN0LTI6MTk2MjMzNzc1NTE4OmNoYW5uZWwvbXVXaUVQaTg4ZW5NIiwiYXdzOmFjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbiI6Imh0dHBzOi8va2ljay5jb20saHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20saHR0cHM6Ly8qLmtpY2subGl2ZSxodHRwczovL3BsYXllci5raWNrLmNvbSxodHRwczovL2FkbWluLmtpY2suY29tLGh0dHBzOi8vYmV0YS5raWNrLmNvbSxodHRwczovL25leHQua2ljay5jb20saHR0cHM6Ly9kYXNoYm9hcmQua2ljay5jb20saHR0cHM6Ly8qLnByZXZpZXcua2ljay5jb20saHR0cHM6Ly94Ym94LmtpY2suY29tLGh0dHBzOi8vcGxheXN0YXRpb24ua2ljay5jb20iLCJhd3M6c3RyaWN0LW9yaWdpbi1lbmZvcmNlbWVudCI6ZmFsc2UsImV4cCI6MTc2ODMwMTY0NH0.j1ahNR1RIhUlWjNU1wVLJiz5O2UDb7amhLkOTSkJ5xTSGlW98bflz69vgFoScomLmnN5YrKJsMXIYiddpF4pb9HxelbBN6LjfRZtA5ErUuGrtw6kGRbHyGwE-iums0wk";

function updateM3U8() {
    const now = new Date();
    const nextUpdate = new Date(now.getTime() + 5 * 60000);
    
    const content = `#EXTM3U
# Generated: ${now.toISOString()}
# Channel: sgsafsfsfsfsfs
# Title: My first stream.
# Status: LIVE
# Viewers: 2
# Update Interval: 5 minutes
# Next Update: ${nextUpdate.toISOString()}

#EXTINF:-1,My first stream.
${M3U8_URL}`;

    fs.writeFileSync('index.m3u8', content);
    console.log(`✅ Updated index.m3u8 at ${now.toLocaleTimeString()}`);
}

// Run now
updateM3U8();

// Run every 5 minutes
setInterval(updateM3U8, 5 * 60 * 1000);

console.log('M3U8 updater started. Will update every 5 minutes.');
console.log(`Using URL from your API response (token expires: 2026-01-13)`);
