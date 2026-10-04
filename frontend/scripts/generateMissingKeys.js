import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');
const enPath = path.join(srcDir, 'locales/en.json');
const hiPath = path.join(srcDir, 'locales/hi.json');

const keys = new Set();

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Match t('key') or t(`key`)
      const regex = /t\(['"`]([\w.]+)['"`][),]/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
      }
    }
  }
}

scanDir(srcDir);

function buildDict(keysSet, defaultValuePrefix) {
  const dict = {};
  for (const key of keysSet) {
    const parts = key.split('.');
    let current = dict;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    const last = parts[parts.length - 1];
    if (!current[last]) {
      current[last] = `${defaultValuePrefix} ${last}`;
    }
  }
  return dict;
}

// Preserve existing keys
const existingEn = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const existingHi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

function mergeDicts(source, target) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      if (!target[key]) target[key] = {};
      mergeDicts(source[key], target[key]);
    } else {
      if (!target[key]) target[key] = source[key];
    }
  }
}

const newEn = buildDict(keys, '[EN]');
const newHi = buildDict(keys, '[HI]');

mergeDicts(existingEn, newEn);
mergeDicts(existingHi, newHi);

fs.writeFileSync(enPath, JSON.stringify(newEn, null, 2));
fs.writeFileSync(hiPath, JSON.stringify(newHi, null, 2));

console.log(`Generated ${keys.size} keys.`);
