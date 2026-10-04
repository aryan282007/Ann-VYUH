const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

content = content.replace(/function openAppModal\(\) \{[\s\S]*?setShowModal\(true\);\s*\}/, unction openAppModal() {
    setModalContent({
      title: lang === 'en' ? 'App Under Development' : 'App Under Development (Demo)',
      body: t('home.cta.installApp.comingSoon'),
      image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
    setShowModal(true);
  });

content = content.replace(/\{lang === 'en' \? 'Exit' : '.*?'\}/, "{t('nav.logout').replace('Logout', 'Exit').replace('??? ???', '??? ????')}");

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
