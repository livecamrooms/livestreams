// generate.js
const fs = require('fs');
const fetch = require('node-fetch');

// --- CONFIGURATION ---
const AFFILIATE_ID = 'E8bhk';
// Choose a tour code that works for embedding (test from your list)
const TOUR_CODE = 'gLDS';  // try 'dU9X', 'hr8m', '41Ea', etc.
// Use the JSON endpoint that doesn't require client_ip
const API_URL = `https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=${AFFILIATE_ID}`;
const TOP_N = 5;

async function fetchRooms() {
  console.log('Fetching rooms from API...');
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`API returned ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('API response is not an array');
  }
  console.log(`Received ${data.length} rooms.`);
  return data;
}

function buildHtml(topRooms) {
  let iframes = '';
  topRooms.forEach(room => {
    const embedUrl = `https://chaturbate.com/affiliates/in/?tour=${TOUR_CODE}&campaign=${AFFILIATE_ID}&track=default&room=${room.username}&bgcolor=white`;
    iframes += `
    <div class="room">
      <h3>${room.username} (👁️ ${room.viewers} viewers)</h3>
      <iframe src="${embedUrl}" width="100%" height="400" frameborder="0" scrolling="no" allowfullscreen></iframe>
    </div>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Top Live Cams</title>
  <style>
    body { font-family: Arial, sans-serif; background: #111; color: #ddd; text-align: center; margin: 0; padding: 20px; }
    h1 { color: #f80; }
    .room { margin: 2rem auto; max-width: 800px; background: #222; padding: 1rem; border-radius: 8px; }
    iframe { border-radius: 8px; width: 100%; }
    footer { margin-top: 2rem; color: #666; font-size: 0.9rem; }
    a { color: #f80; }
  </style>
</head>
<body>
  <h1>🔥 Top ${TOP_N} Chaturbate Rooms Right Now</h1>
  ${iframes}
  <footer>
    <p>18 U.S.C. 2257 Compliance: All models are 18+.</p>
    <p><a href="https://chaturbate.com/in/?tour=3Mc9&campaign=${AFFILIATE_ID}&track=default" rel="nofollow">Join Chaturbate</a></p>
  </footer>
</body>
</html>`;
}

async function main() {
  const rooms = await fetchRooms();
  const sorted = rooms.sort((a, b) => b.viewers - a.viewers);
  const top = sorted.slice(0, TOP_N);
  console.log(`Top rooms: ${top.map(r => r.username).join(', ')}`);
  const html = buildHtml(top);
  fs.writeFileSync('index.html', html);
  console.log('index.html generated successfully.');
}

main().catch(err => {
  console.error('FATAL ERROR:', err.message);
  process.exit(1);
});
