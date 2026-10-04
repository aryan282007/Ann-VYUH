const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

// Icons
content = content.replace(/'dY-",\?'/, "'📅'");
content = content.replace(/'\?,\?'/, "'⏳'");
content = content.replace(/'dY'3'/, "'💳'");
content = content.replace(/'dY"'/, "'📢'");
content = content.replace(/'dY"\?'/, "'📍'");
content = content.replace(/'dYO'/, "'📝'");
content = content.replace(/>dY"z /, ">📞 ");

// Arrows & Checkmarks
content = content.replace(/\+'/g, "→");
content = content.replace(/o"/g, "✓");

// Text
content = content.replace(/ \. "\? " VYUH/g, "अन्न VYUH");
content = content.replace(/How  \. "\? " VYUH works/g, "How अन्न VYUH works");
content = content.replace(/Why  \. "\? " VYUH/g, "Why अन्न VYUH");
content = content.replace(/since  \. "\? " VYUH/g, "since अन्न VYUH");
content = content.replace(/\{t\('home.help.howItWorks'\)\} →<\/a>/g, "{t('home.help.howItWorks')} →</a>");
content = content.replace(/\{t\('nav.centres'\)\} →/g, "{t('nav.centres')} →");

// Remove the staff login code correctly
content = content.replace(/\{\/\* Procurement-centre and admin sign-in live only here on the homepage[\s\S]*?<\/div>\n      <\/div>/, '');

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
