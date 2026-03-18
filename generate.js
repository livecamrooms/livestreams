// generate.js
const fs = require('fs');
const fetch = require('node-fetch');

// --- CONFIGURATION ---
const AFFILIATE_CAMPAIGN = 'T2CSW';
// Choose a tour code that works for embedding (test one from your list)
const TOUR_CODE = 'grq0';  // try 'grq0', 'dU9X', 'hr8m', etc.
const API_URL = `https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=${AFFILIATE_CAMPAIGN}&format=json`;
const TOP_N = 5;  // number of top rooms to embed

// --- FETCH ROOMS ---
async function fetchRooms() {
  console.log('Fetching rooms...');
  const response = await fetch(API_URL);
  const data = await response.json();
  console.log(`Received ${data.length} rooms.`);
  return data;
}

// --- GENERATE HTML ---
function buildHtml(topRooms) {
  // Build iframe HTML for each top room
  let iframes = '';
  topRooms.forEach(room => {
    const embedUrl = `https://chaturbate.com/affiliates/in/?tour=${TOUR_CODE}&campaign=${AFFILIATE_CAMPAIGN}&track=default&room=${room.username}&bgcolor=white`;
    iframes += `
    <div class="room">
      <h3>${room.username} (👁️ ${room.viewers} viewers)</h3>
      <iframe src="${embedUrl}" width="100%" height="400" frameborder="0" scrolling="no"></iframe>
    </div>
    `;
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Top Live Cams</title>
  <style>
    body { font-family: Arial; background: #111; color: #ddd; text-align: center; }
    h1 { color: #f80; }
    .room { margin: 2rem auto; max-width: 800px; background: #222; padding: 1rem; border-radius: 8px; }
    iframe { border-radius: 8px; }
    footer { margin-top: 2rem; color: #666; }
    a { color: #f80; }
  </style>
</head>
<body>
  <h1>🔥 Top ${TOP_N} Chaturbate Rooms Right Now</h1>
  ${iframes}
  <footer>
    <p>18 U.S.C. 2257 Compliance: All models are 18+.</p>
    <p><a href="https://chaturbate.com/in/?tour=3Mc9&campaign=${AFFILIATE_CAMPAIGN}&track=default" rel="nofollow">Join Chaturbate</a></p>
  </footer>
</body>
</html>`;
}

// --- MAIN ---
async function main() {
  const rooms = await fetchRooms();
  // Sort by viewers descending
  const sorted = rooms.sort((a, b) => b.viewers - a.viewers);
  const top = sorted.slice(0, TOP_N);
  console.log(`Top rooms: ${top.map(r => r.username).join(', ')}`);
  const html = buildHtml(top);
  fs.writeFileSync('index.html', html);
  console.log('index.html generated successfully.');
}

main().catch(console.error);
