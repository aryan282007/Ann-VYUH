import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const enPath = path.join(__dirname, '../src/locales/en.json');
const hiPath = path.join(__dirname, '../src/locales/hi.json');

const enDict = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiDict = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

let hasError = false;

function checkKeys(source, target, prefix = '') {
  for (const key in source) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in target)) {
      console.error(`Missing key in translation: ${fullKey}`);
      hasError = true;
    } else if (typeof source[key] === 'object' && typeof target[key] === 'object') {
      checkKeys(source[key], target[key], fullKey);
    }
  }
}

console.log('Checking en.json against hi.json...');
checkKeys(enDict, hiDict);

console.log('Checking hi.json against en.json...');
checkKeys(hiDict, enDict);

if (hasError) {
  console.error('Translation validation failed: missing keys detected.');
  process.exit(1);
} else {
  console.log('Translations are perfectly synchronized.');
}

