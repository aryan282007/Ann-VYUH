const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');

// Replace the max-w-[1400px] and lg:px-12 with max-w-full and a standard px-6
content = content.replace(
  /className="mx-auto flex w-full max-w-\[1400px\] flex-wrap items-center justify-between gap-2 border-b border-border px-6 py-4 lg:px-12"/,
  'className="mx-auto flex w-full max-w-full flex-wrap items-center justify-between gap-2 border-b border-border px-6 md:px-8 py-4"'
);

fs.writeFileSync('frontend/src/components/Navbar.jsx', content, 'utf8');
