const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');

content = content.replace(/alt="\?\?\?\? VYUH"/, 'alt="Ann VYUH Logo"');

fs.writeFileSync('frontend/src/components/Navbar.jsx', content, 'utf8');
