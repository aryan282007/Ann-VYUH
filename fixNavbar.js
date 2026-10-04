const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');
content = content.replace(/<span className="text-h3 text-primary">.*?<\/span>/, '<span className="text-h3 text-primary">???? VYUH</span>');
content = content.replace(/<button className="text-ink font-bold hover:text-primary">.*?<\/button>/, '<button className="text-ink font-bold hover:text-primary">A/?</button>');
fs.writeFileSync('frontend/src/components/Navbar.jsx', content, 'utf8');
