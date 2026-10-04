const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');
const textData = JSON.parse(fs.readFileSync('welcome_text.json', 'utf8'));

// First, ensure `useEffect` is imported.
if (!content.includes('import { useState, useEffect }')) {
  content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
}

// Then, inject the useEffect right below `const [modalContent, setModalContent] = ...`
const useEffectHook = `
  useEffect(() => {
    // Only show once per session to avoid annoying the user during testing
    if (!sessionStorage.getItem('welcomeShown')) {
      setModalContent({
        title: lang === 'en' ? '${textData.title_en}' : '${textData.title_hi}',
        body: lang === 'en' ? '${textData.body_en}' : '${textData.body_hi}',
        image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800'
      });
      setShowModal(true);
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [lang]);
`;

content = content.replace(/(const \[modalContent, setModalContent\] = useState\(\{.*?\}\);)/s, "$1\n" + useEffectHook);

// Also change the Exit button color to yellow as per the screenshot, just for this modal or globally.
content = content.replace(/className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-2\.5 rounded-full transition-all active:scale-95"/, 'className="bg-[#FFC107] hover:bg-[#FFB300] text-ink font-bold px-10 py-2.5 rounded-full transition-all active:scale-95 shadow-md"');

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
