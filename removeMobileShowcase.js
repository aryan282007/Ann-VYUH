const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

// Regex to remove the 4.5 Mobile App Showcase section
content = content.replace(/\{\/\* 4\.5 Mobile App Showcase \*\/\}[\s\S]*?<\/section>/, '');

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
