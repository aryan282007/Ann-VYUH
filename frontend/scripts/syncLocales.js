import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, '../src/locales/en.json');
const hiPath = path.join(__dirname, '../src/locales/hi.json');

const enDict = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiDict = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

function mergeKeys(source, target) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      mergeKeys(source[key], target[key]);
    } else {
      if (!(key in target)) {
        // Just use the English string as fallback for missing Hindi translations
        target[key] = source[key];
      }
    }
  }
}

// Ensure hi has all keys from en
mergeKeys(enDict, hiDict);
// Ensure en has all keys from hi
mergeKeys(hiDict, enDict);

fs.writeFileSync(enPath, JSON.stringify(enDict, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(hiDict, null, 2));

console.log('Fixed missing translation keys by mirroring them.');
