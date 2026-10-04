const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');

content = content.replace("className={`${menuOpen ? '✕' : '☰'} w-full flex-col", "className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col");

// Find the corrupted icon which might look like onClick={() =>~</NavLink> - wait, looking at my cat output above:
// onClick={() =>~</NavLink>
// Let's just fix the whole file directly by rewriting Navbar.jsx. It's a small file.
