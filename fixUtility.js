const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/UtilityBar.jsx', 'utf8');
content = content.replace(/<div className="flex items-center gap-2 font-semibold">[\s\S]*?<span className="badge/g, '<div className="flex items-center gap-2 font-semibold">\n          ???? ??? ???? ?????, ???? ??????\n          <span className="badge');
content = content.replace(/<span className="badge bg-danger\/10 text-danger px-1\.5 py-0\.5 text-\[10px\]">.*?<\/span>/, '<span className="badge bg-danger/10 text-danger px-1.5 py-0.5 text-[10px]">????</span>');
fs.writeFileSync('frontend/src/components/UtilityBar.jsx', content, 'utf8');
