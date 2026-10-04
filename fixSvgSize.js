const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');

// 1. Fix the image in the hero section
content = content.replace(
  /<div className="flex-1 w-full flex justify-center md:justify-end">\s*<img src="\/ann-vyuh-app-mockup-v3\.svg" alt="Ann VYUH App Mockup" className="w-full max-w-md drop-shadow-2xl" \/>\s*<\/div>/,
  `<div className="hidden md:flex flex-1 w-full justify-center md:justify-end">
            <img src="/ann-vyuh-app-mockup-v3.svg" alt="Ann VYUH App Mockup" className="w-[260px] lg:w-[300px] object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" />
          </div>`
);

// 2. Revert the widths of the other sections to match the "previous UI"
// The features grid container
content = content.replace(
  /<div className="mx-auto max-w-\[1400px\] px-6 lg:px-12 py-14">/,
  '<div className="mx-auto max-w-5xl px-5 py-14">'
);
// The grid layout itself
content = content.replace(
  /<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">/,
  '<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">'
);

// Quick Services container
content = content.replace(
  /<section className="bg-gradient-to-b from-\[#F5FBFC\] to-\[#F0F8FB\] px-6 lg:px-12 py-14">\s*<div className="mx-auto max-w-\[1400px\]">/,
  '<section className="bg-gradient-to-b from-[#F5FBFC] to-[#F0F8FB] px-5 py-14">\n        <div className="mx-auto max-w-5xl">'
);
// Quick services text center
content = content.replace(
  /<div className="text-center md:text-left">/g,
  '<div className="text-center">'
);

// How it works container
content = content.replace(
  /<section id="how-it-works" className="px-6 lg:px-12 py-14">\s*<div className="mx-auto max-w-\[1400px\]">/,
  '<section id="how-it-works" className="px-5 py-14">\n        <div className="mx-auto max-w-3xl">'
);

// Why it works container
content = content.replace(
  /<section className="bg-\[#F5FBFC\] px-6 lg:px-12 py-14">\s*<div className="mx-auto max-w-\[1400px\]">/,
  '<section className="bg-[#F5FBFC] px-5 py-14">\n        <div className="mx-auto max-w-3xl">'
);

// Need help container
content = content.replace(
  /<section id="need-help" className="px-6 lg:px-12 py-14">\s*<MotionDiv className="mx-auto flex max-w-\[1400px\] flex-col items-start justify-between gap-6 rounded-lg border border-border bg-surface p-8 sm:flex-row sm:items-center"/,
  '<section id="need-help" className="px-5 py-14">\n        <MotionDiv className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-6 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center"'
);

// Let's also adjust the hero max-w from 1400 to 6xl so it's not ridiculously wide, while still bringing the left margin in compared to 5xl.
content = content.replace(
  /<div className="mx-auto flex w-full max-w-\[1400px\] flex-col md:flex-row items-center justify-between gap-10 animate-fade-in relative z-10">/,
  '<div className="mx-auto flex w-full max-w-6xl flex-col md:flex-row items-center justify-between gap-10 animate-fade-in relative z-10">'
);
content = content.replace(
  /className="relative overflow-hidden rounded-b-\[2\.5rem\] bg-\[#0A6451\] px-6 pb-16 pt-14 lg:px-12 md:rounded-b-\[4rem\] md:pb-24 md:pt-20"/,
  'className="relative overflow-hidden rounded-b-[2.5rem] bg-[#0A6451] px-5 pb-16 pt-14 md:rounded-b-[4rem] md:pb-24 md:pt-20"'
);

fs.writeFileSync('frontend/src/pages/Landing.jsx', content, 'utf8');
