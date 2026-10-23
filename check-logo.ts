import fs from 'fs';
const stats = fs.statSync('public/images/logo.png');
console.log('Size:', stats.size);
const content = fs.readFileSync('public/images/logo.png', 'utf8');
console.log('Content start:', content.substring(0, 100));
