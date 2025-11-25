import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const option = process.argv[2];

if (!['1', '2', '4'].includes(option)) {
    console.error('Please specify a valid option: 1, 2, or 4');
    console.log('Usage: node scripts/switch-logo.js <option>');
    process.exit(1);
}

const sourceFile = path.join(__dirname, `../public/logos/option${option}.png`);
const publicDir = path.join(__dirname, '../public');

const targets = [
    'favicon.png',
    'pwa-192.png',
    'pwa-512.png',
    'apple-touch-icon.png'
];

try {
    targets.forEach(target => {
        fs.copyFileSync(sourceFile, path.join(publicDir, target));
        console.log(`Updated ${target}`);
    });
    console.log(`\nSuccessfully switched to Logo Option ${option}! 🎨`);
} catch (error) {
    console.error('Error switching logo:', error);
}
