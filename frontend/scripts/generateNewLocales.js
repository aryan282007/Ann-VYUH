import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, '../src/locales/en.json');
const localesDir = path.join(__dirname, '../src/locales');

// Parse .env manually
const envFile = fs.readFileSync(path.join(__dirname, '../../backend/.env'), 'utf8');
const apiKeyMatch = envFile.match(/GEMINI_API_KEY=(.+)/);
if (apiKeyMatch) process.env.GEMINI_API_KEY = apiKeyMatch[1].trim();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

const targetLanguages = [
  { code: 'mr', name: 'Marathi (Devanagari script)' },
  { code: 'gu', name: 'Gujarati (Gujarati script)' },
  { code: 'bn', name: 'Bengali (Bengali script)' },
  { code: 'te', name: 'Telugu (Telugu script)' },
  { code: 'kn', name: 'Kannada (Kannada script)' }
];

async function translate() {
  const enDict = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const keys = Object.keys(enDict);
  
  console.log(`Loaded en.json with ${keys.length} keys.`);

  for (const target of targetLanguages) {
    console.log(`\nStarting translation for ${target.name} (${target.code})...`);
    const targetPath = path.join(localesDir, `${target.code}.json`);
    
    // Load existing if available to resume
    let targetDict = {};
    if (fs.existsSync(targetPath)) {
      try { targetDict = JSON.parse(fs.readFileSync(targetPath, 'utf8')); } catch(e){}
    }

    const missingKeys = keys.filter(k => !targetDict[k] || targetDict[k] === enDict[k]);
    if (missingKeys.length === 0) {
      console.log(`All keys translated for ${target.code}.`);
      continue;
    }

    const chunkSize = 40;
    for (let i = 0; i < missingKeys.length; i += chunkSize) {
      const chunkKeys = missingKeys.slice(i, i + chunkSize);
      const chunkObj = {};
      for (const k of chunkKeys) chunkObj[k] = enDict[k];

      console.log(`[${target.code}] Translating chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(missingKeys.length / chunkSize)}...`);
      
      const prompt = `
You are a professional translator for an Indian Agriculture portal (Ann-VYUH).
Translate the values of the following JSON object from English into natural ${target.name} suitable for farmers.
Maintain the exact JSON structure and keys. Only translate the values.
Keep any {variables} intact.

JSON:
${JSON.stringify(chunkObj, null, 2)}
`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
        let translatedChunk;
        if (jsonMatch) {
          translatedChunk = JSON.parse(jsonMatch[1]);
        } else {
          translatedChunk = JSON.parse(text);
        }

        for (const k in translatedChunk) {
          targetDict[k] = translatedChunk[k];
        }
        
        // Save progressively
        fs.writeFileSync(targetPath, JSON.stringify(targetDict, null, 2), 'utf8');
      } catch (err) {
        console.error(`[${target.code}] Error translating chunk:`, err.message);
      }
    }
    console.log(`Finished ${target.code}.`);
  }
}

translate().catch(console.error);
