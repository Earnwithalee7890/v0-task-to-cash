const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 512x512 canvas
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// Dark background matching app theme
ctx.fillStyle = '#0a0e27';
ctx.fillRect(0, 0, 512, 512);

// Add subtle neon glowing dots/particles
const particles = [
    { x: 100, y: 120, size: 3, color: 'rgba(0, 217, 255, 0.6)' },
    { x: 380, y: 200, size: 2, color: 'rgba(168, 85, 247, 0.5)' },
    { x: 200, y: 400, size: 2.5, color: 'rgba(0, 255, 204, 0.4)' },
    { x: 420, y: 90, size: 2, color: 'rgba(0, 217, 255, 0.5)' },
    { x: 80, y: 350, size: 3, color: 'rgba(168, 85, 247, 0.6)' },
    { x: 300, y: 480, size: 2, color: 'rgba(0, 255, 204, 0.5)' },
    { x: 450, y: 400, size: 2.5, color: 'rgba(0, 217, 255, 0.4)' },
];

// Draw glowing particles
particles.forEach(p => {
    // Outer glow
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
    ctx.fill();

    // Core dot
    ctx.fillStyle = p.color.replace(/[\d.]+\)/, '0.9)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
});

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/splash.png', buffer);

console.log('Subtle neon splash.png created!');
