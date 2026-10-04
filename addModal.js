const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

// Inject the Modal component and state logic
const modalLogic = `
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '', image: '' });

  function openAppModal() {
    setModalContent({
      title: lang === 'en' ? 'App Under Development' : 'ऐप निर्माण अधीन है',
      body: lang === 'en' 
        ? 'Our mobile application (Android APK) is currently under active development phase. It will feature offline AI audio tour guides, interactive 3D maps, and live queue alerts.'
        : 'हमारा मोबाइल एप्लिकेशन (Android APK) वर्तमान में सक्रिय विकास चरण में है। इसमें ऑफ़लाइन AI ऑडियो गाइड, इंटरैक्टिव 3D मैप्स और लाइव कतार अलर्ट की सुविधा होगी।',
      image: 'https://images.pexels.com/photos/36436061/pexels-photo-36436061.jpeg?auto=compress&cs=tinysrgb&w=800' // using the farmer image as placeholder since the uploaded one has a temple
    });
    setShowModal(true);
  }
`;

// Add useState to import if not there
if (!content.includes('import { useState }')) {
  content = content.replace("import { Link } from 'react-router-dom';", "import { useState } from 'react';\nimport { Link } from 'react-router-dom';");
}

// Inject state inside Landing component
content = content.replace('export default function Landing() {\n  const { t, lang } = useLanguage();', 'export default function Landing() {\n  const { t, lang } = useLanguage();\n' + modalLogic);

// Add the Modal JSX at the bottom of the return
const modalJSX = `
      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-10 backdrop-blur"
            >
              ✕
            </button>
            
            {/* Image Banner */}
            <div className="h-48 w-full overflow-hidden relative">
              <img src={modalContent.image} alt="Modal Banner" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-14 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-ink">
                ♡
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-ink mb-3">{modalContent.title}</h3>
              <p className="text-sm text-muted font-medium leading-relaxed mb-6">
                {modalContent.body}
              </p>
              
              <button 
                onClick={() => setShowModal(false)}
                className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-2.5 rounded-full transition-all active:scale-95"
              >
                {lang === 'en' ? 'Exit' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

content = content.replace('    </div>\n  );\n}', modalJSX);

// Replace onClick={() => window.alert(...)} with openAppModal()
content = content.replace(/onClick=\{.*?window\.alert.*?\}/g, 'onClick={openAppModal}');

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
