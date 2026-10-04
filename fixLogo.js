const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');

content = content.replace(
  /<img src="\/ann-vyuh-logo.svg" alt="" className="h-9 w-9" aria-hidden="true" \/>\s*<span className="text-h3 text-primary">.*?<\/span>/,
  '<img src="/ann-vyuh-logo.svg" alt="???? VYUH" className="h-12 w-auto" />'
);

fs.writeFileSync('frontend/src/components/Navbar.jsx', content, 'utf8');
