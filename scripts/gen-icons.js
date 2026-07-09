/* Generates PartyBox app icons/splash from inline SVG using @resvg/resvg-js. */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const OUT = path.join(__dirname, '..', 'assets', 'images');

// --- Brand ---
const VIOLET = '#7C3AED';
const MAGENTA = '#EC4899';
const DARK = '#0B0910';

// Gradient background (full square; iOS/Android apply their own masks).
const gradient = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${VIOLET}"/>
      <stop offset="1" stop-color="${MAGENTA}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.32" cy="0.26" r="0.75">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

const bgRect = `<rect width="1024" height="1024" fill="url(#bg)"/><rect width="1024" height="1024" fill="url(#glow)"/>`;

// The "party box" mark (present + bow + confetti), designed on a 1024 canvas.
const mark = `
  <g>
    <!-- confetti burst -->
    <rect x="356" y="356" width="40" height="16" rx="8" fill="#22D3EE" transform="rotate(-28 376 364)"/>
    <rect x="628" y="346" width="40" height="16" rx="8" fill="#A3E635" transform="rotate(22 648 354)"/>
    <rect x="496" y="292" width="20" height="20" rx="5" fill="#FBBF24" transform="rotate(18 506 302)"/>
    <circle cx="452" cy="322" r="14" fill="#FBBF24"/>
    <circle cx="574" cy="312" r="12" fill="#22D3EE"/>
    <circle cx="404" cy="420" r="11" fill="#FFFFFF"/>
    <circle cx="648" cy="432" r="11" fill="#FFFFFF"/>
    <circle cx="560" cy="382" r="9" fill="#A3E635"/>

    <!-- box body -->
    <rect x="344" y="566" width="336" height="300" rx="34" fill="#FFFFFF"/>
    <rect x="496" y="566" width="32" height="300" fill="${VIOLET}"/>
    <rect x="344" y="700" width="336" height="30" fill="${VIOLET}"/>

    <!-- lid -->
    <g transform="rotate(-5 512 528)">
      <rect x="324" y="492" width="376" height="74" rx="22" fill="#FFFFFF"/>
      <rect x="496" y="492" width="32" height="74" fill="${VIOLET}"/>
    </g>

    <!-- bow -->
    <circle cx="475" cy="474" r="26" fill="none" stroke="${VIOLET}" stroke-width="20"/>
    <circle cx="549" cy="474" r="26" fill="none" stroke="${VIOLET}" stroke-width="20"/>
    <circle cx="512" cy="486" r="13" fill="${VIOLET}"/>
  </g>`;

const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${gradient}${bgRect}<g transform="translate(0 -48)">${mark}</g></svg>`;
const svgBg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${gradient}${bgRect}</svg>`;
// Mark on transparent, scaled to Android adaptive safe zone (~62%). Center the mark's visual centre (~y585).
const svgForeground = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><g transform="translate(512 512) scale(0.62) translate(-512 -585)">${mark}</g></svg>`;
// Mark on transparent for the splash (a touch larger).
const svgSplash = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><g transform="translate(512 512) scale(0.8) translate(-512 -585)">${mark}</g></svg>`;

function render(svg, size, file) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  fs.writeFileSync(path.join(OUT, file), png);
  console.log(`✓ ${file} (${size}px, ${(png.length / 1024).toFixed(1)} KB)`);
}

render(svgFull, 1024, 'icon.png');
render(svgBg, 1024, 'android-icon-background.png');
render(svgForeground, 1024, 'android-icon-foreground.png');
render(svgSplash, 1024, 'splash-icon.png');
render(svgFull, 196, 'favicon.png');
console.log('done');
