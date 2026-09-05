const fs = require('fs');
const path = require('path');

const bgPath = 'C:/Users/guill/.gemini/antigravity/brain/c96d6a3f-56da-479c-b7b0-d74e9f955650/twitter_banner_bg_1788618636413.jpg';
const bgData = fs.readFileSync(bgPath).toString('base64');

const tokens = [
  'microduck.png',
  'OPTIMUS.png',
  'AI.png',
  'CASHCAT.png',
  'ROBINCAT.png',
  'MOO.png',
  'CACHE.png',
  'GRASS.png',
  'BONER.png',
  'PONS.png'
];

const tokensDir = 'c:/Users/guill/Documents/GateMind/Berkshire Hoodaway/assets/tokens';
const tokenB64s = tokens.map(t => {
  return {
    name: t.replace('.png', ''),
    data: 'data:image/png;base64,' + fs.readFileSync(path.join(tokensDir, t)).toString('base64')
  };
});

// Vault opening center in 1920x1080 background:
// Center is approx X=1410, Y=455
const cx = 1410;
const cy = 450;

const outerCount = 7;
const outerRadius = 165;
const innerCount = 3;
const innerRadius = 70;

let badgesHtml = '';

// Outer 7 tokens
for(let i=0; i<outerCount; i++) {
  const angle = (i / outerCount) * 2 * Math.PI - Math.PI/2;
  const x = cx + outerRadius * Math.cos(angle);
  const y = cy + outerRadius * Math.sin(angle);
  const t = tokenB64s[i];
  badgesHtml += `<div class="token-node" style="left: ${x - 48}px; top: ${y - 48}px;"><img src="${t.data}" /><span class="label">${t.name}</span></div>\n`;
}

// Inner 3 tokens
for(let i=0; i<innerCount; i++) {
  const angle = (i / innerCount) * 2 * Math.PI + Math.PI/6;
  const x = cx + innerRadius * Math.cos(angle);
  const y = cy + innerRadius * Math.sin(angle);
  const t = tokenB64s[outerCount + i];
  badgesHtml += `<div class="token-node inner" style="left: ${x - 45}px; top: ${y - 45}px;"><img src="${t.data}" /><span class="label">${t.name}</span></div>\n`;
}

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1920px; height: 1080px; overflow: hidden; background: #030a06; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }
.banner-container { position: relative; width: 1920px; height: 1080px; }
.bg-img { width: 1920px; height: 1080px; object-fit: cover; }
.vault-glow { position: absolute; left: 1150px; top: 185px; width: 520px; height: 520px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(212,163,115,0.2) 50%, transparent 75%); filter: blur(20px); pointer-events: none; }
.vault-rim { position: absolute; left: 1145px; top: 180px; width: 530px; height: 530px; border-radius: 50%; border: 3px solid rgba(255,215,0,0.4); box-shadow: inset 0 0 40px rgba(0,0,0,0.8), 0 0 30px rgba(16,185,129,0.3); pointer-events: none; }
.token-node { position: absolute; width: 96px; height: 96px; border-radius: 50%; padding: 4px; background: linear-gradient(135deg, #ffd700, #10b981, #052e16); box-shadow: 0 12px 28px rgba(0,0,0,0.9), 0 0 20px rgba(16,185,129,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; }
.token-node.inner { width: 90px; height: 90px; background: linear-gradient(135deg, #f59e0b, #34d399, #022c22); }
.token-node img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #041f14; border: 2px solid #ffd700; }
.token-node .label { position: absolute; bottom: -18px; font-size: 11px; font-weight: 800; font-family: monospace; color: #ffd700; background: rgba(3,10,6,0.94); padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(255,215,0,0.6); text-shadow: 0 1px 3px black; white-space: nowrap; }
.badge-vault { position: absolute; left: 1210px; top: 735px; background: rgba(3,10,6,0.94); border: 2px solid rgba(255,215,0,0.75); padding: 10px 28px; border-radius: 30px; color: #ffd700; font-family: monospace; font-size: 16px; font-weight: 800; letter-spacing: 2px; box-shadow: 0 10px 30px rgba(0,0,0,0.95), 0 0 25px rgba(16,185,129,0.5); z-index: 20; }
</style>
</head>
<body>
<div class="banner-container">
  <img class="bg-img" src="data:image/jpeg;base64,${bgData}" />
  <div class="vault-glow"></div>
  <div class="vault-rim"></div>
  ${badgesHtml}
  <div class="badge-vault">🔒 10 CURATED MEMES • 10% EACH PERPETUALLY LOCKED</div>
</div>
</body>
</html>`;

fs.writeFileSync('C:/Users/guill/.gemini/antigravity/brain/c96d6a3f-56da-479c-b7b0-d74e9f955650/banner-composite.html', html);
console.log('banner-composite.html created successfully!');
