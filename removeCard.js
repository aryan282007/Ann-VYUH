const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

// Regex to remove the MotionDiv card with the farmer photo
content = content.replace(/<MotionDiv className="grid gap-6 overflow-hidden rounded-lg border border-border bg-surface shadow-sm shadow-ink\/5 md:grid-cols-2" \{\.\.\.sectionMotion\}>[\s\S]*?<\/MotionDiv>/, '');

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
