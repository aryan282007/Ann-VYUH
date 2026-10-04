const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');
const textData = JSON.parse(fs.readFileSync('modal_text.json', 'utf8'));

// Replace the English string and the `t('home.cta.installApp.comingSoon')` (because it's tied to the old string) with the new dual language string.
content = content.replace(/body: t\('home\.cta\.installApp\.comingSoon'\),/g, "body: lang === 'en' ? '" + textData.en + "' : '" + textData.hi + "',");

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
