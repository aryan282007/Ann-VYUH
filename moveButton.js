const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

// 1. Remove the "Install app" button from the left button group
content = content.replace(
  /\s*<button[\s\S]*?onClick=\{openAppModal\}[\s\S]*?<\/button>/,
  ''
);

// 2. Replace the isolated image with a new container holding both the image and the new yellow button
const rightSideGroup = `
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
            <img src="/ann-vyuh-app-mockup-v3.svg" alt="Ann VYUH App Mockup" className="w-[120px] lg:w-[150px] xl:w-[180px] object-contain drop-shadow-2xl" />
            <button
              type="button"
              onClick={openAppModal}
              className="rounded-full bg-[#FFC107] px-6 py-2 text-sm font-bold text-ink transition-transform hover:scale-105 hover:bg-[#FFB300] active:scale-95 flex items-center gap-2 shadow-lg"
            >
              📱 {t('home.cta.installApp.label')}
            </button>
          </div>`;

content = content.replace(
  /\s*<img src="\/ann-vyuh-app-mockup-v3\.svg" alt="Ann VYUH App Mockup" className="hidden md:block absolute right-0 top-1\/2 -translate-y-1\/2 w-\[120px\] lg:w-\[150px\] xl:w-\[180px\] object-contain drop-shadow-2xl" \/>/,
  rightSideGroup
);

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
