const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

// Replace entire FEATURES block
content = content.replace(/const FEATURES = \[[\s\S]*?\];/, `const FEATURES = [
  { key: 'bookSlot', icon: '📅' },
  { key: 'queue', icon: '⏳' },
  { key: 'payment', icon: '💳' },
  { key: 'report', icon: '📢' },
  { key: 'centres', icon: '📍' },
];`);

// Replace entire QUICK_SERVICES block
content = content.replace(/const QUICK_SERVICES = \[[\s\S]*?\];/, `const QUICK_SERVICES = [
  { key: 'register', icon: '📝', to: '/farmer/register' },
  { key: 'bookSlot', icon: '📅', to: '/farmer/book' },
  { key: 'myBookings', icon: '📅', to: '/farmer/bookings' },
  { key: 'queue', icon: '⏳', to: '/farmer/bookings' },
  { key: 'payment', icon: '💳', to: '/farmer/payments' },
  { key: 'report', icon: '📢', to: '/farmer/complaint' },
  { key: 'centres', icon: '📍', to: '/centres/schedules' },
];`);

// Fix text
content = content.replace(/<h1 className="mt-2 text-h1 text-white">.*?VYUH<\/h1>/, '<h1 className="mt-2 text-h1 text-white">अन्न VYUH</h1>');

// Fix arrows (match ' +' or similar garbled string)
content = content.replace(/\+'/g, "→");

// Fix checkmarks
content = content.replace(/o"/g, "✓");

// Fix IVR phone icon
content = content.replace(/<h2 className="text-h3">.*? \{t\('landing.ivr.title'\)\}<\/h2>/, '<h2 className="text-h3">📞 {t(\'landing.ivr.title\')}</h2>');

// Remove staff login block (the previous regex was too specific maybe)
content = content.replace(/\{\/\* Procurement-centre and admin sign-in live only here on the homepage[\s\S]*?<\/div>\n      <\/div>/, '');

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
