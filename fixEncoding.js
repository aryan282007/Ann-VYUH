const fs = require('fs');

let nav = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');
nav = nav.replace(/<span className="text-h3 text-primary">.*?<\/span>/g, '<span className="text-h3 text-primary">अन्न VYUH</span>');
nav = nav.replace(/<button className="text-ink font-bold hover:text-primary">.*?<\/button>/g, '<button className="text-ink font-bold hover:text-primary">A/अ</button>');
nav = nav.replace(/{menuOpen \? '.*?' : '.*?'}/g, "{menuOpen ? '✕' : '☰'}");
nav = nav.replace(/>.*?</g, (match) => {
    if (match.includes('')) {
        return '>☰<'; // Replace any corrupted characters with safe ones where applicable, but wait, the hamburger menu is just ☰
    }
    return match;
});
fs.writeFileSync('frontend/src/components/Navbar.jsx', nav, 'utf8');

let util = fs.readFileSync('frontend/src/components/UtilityBar.jsx', 'utf8');
util = util.replace(/<div className="flex items-center gap-2 font-semibold">[\s\S]*?<span className="badge/g, '<div className="flex items-center gap-2 font-semibold">\n          कृषि उपज मंडी समिति, मध्य प्रदेश\n          <span className="badge');
util = util.replace(/<span className="badge bg-danger\/10 text-danger px-1\.5 py-0\.5 text-\[10px\]">.*?<\/span>/g, '<span className="badge bg-danger/10 text-danger px-1.5 py-0.5 text-[10px]">डेमो</span>');
fs.writeFileSync('frontend/src/components/UtilityBar.jsx', util, 'utf8');

let admin = fs.readFileSync('frontend/src/layouts/AdminLayout.jsx', 'utf8');
admin = admin.replace(/<h1 className="text-xl font-bold text-primary-dark">.*?<\/h1>/, '<h1 className="text-xl font-bold text-primary-dark">अन्न VYUH</h1>');
admin = admin.replace(/<p className="text-xs text-muted font-medium">.*?<\/p>/, '<p className="text-xs text-muted font-medium">प्रशासनिक पैनल</p>');
admin = admin.replace(/<button className="lg:hidden text-ink" onClick=\{.*?\}\>.*?\<\/button\>/, '<button className="lg:hidden text-ink" onClick={() => setIsSidebarOpen(false)}>✕</button>');
admin = admin.replace(/<button\s+onClick=\{.*?\}\s+className="w-full py-2 text-sm text-danger border border-danger\/30 rounded-lg hover:bg-danger\/5 transition-colors"\s*>.*?<\/button>/, `<button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full py-2 text-sm text-danger border border-danger/30 rounded-lg hover:bg-danger/5 transition-colors"
              >
                लॉग आउट
              </button>`);
admin = admin.replace(/<button\s+onClick=\{.*?\}\s+className="text-ink hover:text-primary transition-colors"\s*>.*?<\/button>/, `<button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-ink hover:text-primary transition-colors"
            >
              ☰
            </button>`);
admin = admin.replace(/placeholder=".*?"/, 'placeholder="खोजें (Ctrl+K)"');
admin = admin.replace(/roleLabels = \{[\s\S]*?\};/, `roleLabels = {
    centre_admin: 'केंद्र प्रबंधक',
    district_admin: 'जिला अधिकारी',
    state_admin: 'राज्य प्रशासक',
    system_admin: 'सिस्टम एडमिन'
  };`);
admin = admin.replace(/navItems = \[[\s\S]*?\];/, `navItems = [
    { name: 'डैशबोर्ड', path: '/admin/dashboard', icon: '📊' },
    { name: 'केंद्र', path: '/admin/centres', icon: '🏢' },
    { name: 'किसान', path: '/admin/farmers', icon: '👨‍🌾' },
    { name: 'कतार प्रबंधन', path: '/admin/queue', icon: '👥' },
    { name: 'खरीद', path: '/admin/procurement', icon: '🌾' },
    { name: 'भुगतान', path: '/admin/payments', icon: '₹' },
    { name: 'सूचनाएं', path: '/admin/notifications', icon: '🔔' },
    { name: 'रिपोर्ट्स', path: '/admin/reports', icon: '📈' },
    { name: 'सेटिंग्स', path: '/admin/settings', icon: '⚙️' },
  ];`);
fs.writeFileSync('frontend/src/layouts/AdminLayout.jsx', admin, 'utf8');
