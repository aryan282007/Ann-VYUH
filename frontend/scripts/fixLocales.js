import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sourceEnPath = path.join(__dirname, '../../../SIH-26032/frontend/src/locales/en.json');
const sourceHiPath = path.join(__dirname, '../../../SIH-26032/frontend/src/locales/hi.json');

const targetEnPath = path.join(__dirname, '../src/locales/en.json');
const targetHiPath = path.join(__dirname, '../src/locales/hi.json');

// Read source files (UTF-8)
let enContent = fs.readFileSync(sourceEnPath, 'utf8');
let hiContent = fs.readFileSync(sourceHiPath, 'utf8');

// Replacements
function applyReplacements(content) {
  return content
    .replace(/HarvQ/g, 'अन्न VYUH')
    .replace(/harvq/g, 'ann-vyuh')
    .replace(/Tamil Nadu/g, 'Madhya Pradesh')
    .replace(/TNCSC/g, 'Procurement Corp');
}

enContent = applyReplacements(enContent);
hiContent = applyReplacements(hiContent);

// Add custom Hindi translations to hiContent (which is currently just English placeholders in the source)
let hiDict = JSON.parse(hiContent);

Object.assign(hiDict, {
  "nav.home": "मुख्य पृष्ठ",
  "nav.about": "हमारे बारे में",
  "nav.bookSlot": "स्लॉट बुक करें",
  "nav.myBookings": "मेरी बुकिंग",
  "nav.centres": "केंद्र अनुसूची",
  "nav.reportIssue": "शिकायत दर्ज करें",
  "nav.profile": "प्रोफ़ाइल",
  "nav.login": "किसान लॉगिन",
  "nav.register": "नया किसान? पंजीकरण करें",
  "nav.logout": "लॉग आउट",
  "home.tagline": "जहाँ हर फसल को अपना समय मिलता है, और हर किसान को उसका मूल्य।",
  "home.cta.register": "किसान के रूप में पंजीकरण करें",
  "home.cta.login": "लॉग इन",
  "home.feature.bookSlot.title": "स्लॉट बुक करें",
  "home.feature.queue.title": "कतार ट्रैक करें",
  "home.feature.payment.title": "भुगतान स्थिति",
  "home.feature.report.title": "शिकायत करें",
  "home.feature.centres.title": "केंद्र अनुसूची",
  "home.feature.register.title": "पंजीकरण करें",
  "home.feature.myBookings.title": "मेरी बुकिंग",
  "home.quickServices.heading": "त्वरित सेवाएँ",
  "home.process.heading": "प्रक्रिया"
});

// Ensure en.json and hi.json have all keys
let enDict = JSON.parse(enContent);

for (const key in enDict) {
  if (!(key in hiDict)) {
    hiDict[key] = enDict[key];
  }
}
for (const key in hiDict) {
  if (!(key in enDict)) {
    enDict[key] = hiDict[key];
  }
}

fs.writeFileSync(targetEnPath, JSON.stringify(enDict, null, 2), 'utf8');
fs.writeFileSync(targetHiPath, JSON.stringify(hiDict, null, 2), 'utf8');

console.log('Restored and translated locales successfully with UTF-8 encoding.');

