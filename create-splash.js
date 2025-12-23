const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 512x512 canvas
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// Make it completely transparent
ctx.clearRect(0, 0, 512, 512);

// Save as PNG (transparent)
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/splash.png', buffer);

console.log('Transparent splash.png created!');
