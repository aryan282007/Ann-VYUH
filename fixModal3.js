const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

content = content.replace(/function openAppModal\(\) \{[\s\S]*?setShowModal\(true\);\s*\}/, `function openAppModal() {
    setModalContent({
      title: lang === 'en' ? 'App Under Development' : 'ऐप निर्माण अधीन है (Demo)',
      body: t('home.cta.installApp.comingSoon'),
      image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
    setShowModal(true);
  }`);

content = content.replace(/\{lang === 'en' \? 'Exit' : '.*?'\}/, "{lang === 'en' ? 'Exit' : 'बंद करें'}");

// Convert to unicode escapes to prevent corruption!
content = content.replace('ऐप निर्माण अधीन है (Demo)', '\\u0910\\u092A \\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0923 \\u0905\\u0927\\u0940\\u0928 \\u0939\\u0948');
content = content.replace("'बंद करें'", "'\\u092C\\u0902\\u0926 \\u0915\\u0930\\u0947\\u0902'");

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
