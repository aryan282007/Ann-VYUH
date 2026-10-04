import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hiPath = path.join(__dirname, '../src/locales/hi.json');

// Initialize Gemini
// Note: using the key from the user's .env file via hardcode for the script execution context
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

async function translate() {
  const hiDict = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
  
  // Find strings that still contain English words (A-Z)
  const toTranslate = {};
  for (const key in hiDict) {
    if (typeof hiDict[key] === 'string' && /[a-zA-Z]{3,}/.test(hiDict[key])) {
      toTranslate[key] = hiDict[key];
    }
  }

  const keysToTranslate = Object.keys(toTranslate);
  console.log(`Found ${keysToTranslate.length} keys to translate.`);

  if (keysToTranslate.length === 0) {
    console.log('Nothing to translate!');
    return;
  }

  // Batch in chunks of 50 to avoid prompt limits or output truncation
  const chunkSize = 50;
  for (let i = 0; i < keysToTranslate.length; i += chunkSize) {
    const chunkKeys = keysToTranslate.slice(i, i + chunkSize);
    const chunkObj = {};
    for (const k of chunkKeys) chunkObj[k] = toTranslate[k];

    console.log(`Translating chunk ${Math.floor(i / chunkSize) + 1}...`);
    const prompt = `
You are a professional Hindi translator for an Indian Agriculture portal (Ann-VYUH).
Translate the values of the following JSON object into natural Hindi suitable for farmers.
Maintain the exact JSON structure and keys. Only translate the values.
Keep any {variables} intact. 

JSON:
${JSON.stringify(chunkObj, null, 2)}
`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract JSON from markdown
      const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || [null, text];
      const translatedChunk = JSON.parse(jsonMatch[1]);

      // Merge back
      for (const k in translatedChunk) {
        hiDict[k] = translatedChunk[k];
      }
    } catch (err) {
      console.error('Error translating chunk:', err.message);
    }
  }

  fs.writeFileSync(hiPath, JSON.stringify(hiDict, null, 2), 'utf8');
  console.log('Translation complete and saved to hi.json');
}

translate();

