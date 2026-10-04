// Hardcoded MP Districts for Prototype

const MP_DISTRICTS = ['Bhopal', 'Indore', 'Ujjain', 'Sehore', 'Vidisha', 'Narmadapuram', 'Jabalpur', 'Gwalior', 'Rewa', 'Sagar', 'Dewas', 'Ratlam'];

function getDistricts(req, res) {
  res.json(MP_DISTRICTS);
}

function getTaluks(req, res) {
  const { district } = req.params;
  if (!MP_DISTRICTS.includes(district)) return res.json([]);
  res.json([`${district} Tehsil`]);
}

function getVillages(req, res) {
  const { district, taluk } = req.params;
  if (!MP_DISTRICTS.includes(district)) return res.json([]);
  res.json([`${district} Village`]);
}

module.exports = {
  getDistricts,
  getTaluks,
  getVillages,
};
