const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');
const modalData = JSON.parse(fs.readFileSync('modal_data.json', 'utf8'));

// Restore the text
content = content.replace(/title: lang === 'en' \? 'App Under Development' : '.*?'/, "title: lang === 'en' ? 'App Under Development' : '" + modalData.title + "'");
content = content.replace(/body: lang === 'en'[\s\S]*?: '.*?'/, "body: lang === 'en'\n        ? 'Our mobile application (Android APK) is currently under active development phase. It will feature offline AI audio tour guides, interactive 3D maps, and live queue alerts.'\n        : '" + modalData.body + "'");
content = content.replace(/\{lang === 'en' \? 'Exit' : '.*?'\}/, "{lang === 'en' ? 'Exit' : '" + modalData.close + "'}");

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
