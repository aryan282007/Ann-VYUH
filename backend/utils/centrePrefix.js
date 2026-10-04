const Centre = require('../models/Centre');

function districtCode(district) {
  if (!district) return 'XXX';
  return district.substring(0, 3).toUpperCase();
}

async function generateCentrePrefix(district) {
  const code = districtCode(district);
  const countInDistrict = await Centre.countDocuments({ district });
  const sequence = String(countInDistrict + 1).padStart(3, '0');
  const candidate = `MP-${code}-${sequence}`;

  const clash = await Centre.exists({ codePrefix: candidate });
  if (!clash) return candidate;

  let n = countInDistrict + 2;
  while (true) {
    const next = `MP-${code}-${String(n).padStart(3, '0')}`;
    if (!(await Centre.exists({ codePrefix: next }))) return next;
    n += 1;
  }
}

module.exports = { generateCentrePrefix };
