const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

// Remove the hardcoded mobile icon from the button
content = content.replace(
  /📱 \{t\('home.cta.installApp.label'\)\}/,
  "{t('home.cta.installApp.label')}"
);

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
