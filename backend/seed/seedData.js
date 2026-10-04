require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CropRate = require('../models/CropRate');
const Staff = require('../models/Staff');
const Farmer = require('../models/Farmer');
const Centre = require('../models/Centre');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');

const MP_DISTRICTS = ['Bhopal', 'Indore', 'Ujjain', 'Sehore', 'Vidisha', 'Narmadapuram', 'Jabalpur', 'Gwalior', 'Rewa', 'Sagar', 'Dewas', 'Ratlam'];
const CROPS = [
  { crop: 'गेहूं', unit: 'क्विंटल', unitWeightKg: 100, ratePerUnit: 2275 },
  { crop: 'धान', unit: 'क्विंटल', unitWeightKg: 100, ratePerUnit: 2183 },
  { crop: 'चना', unit: 'क्विंटल', unitWeightKg: 100, ratePerUnit: 5440 },
  { crop: 'सरसों', unit: 'क्विंटल', unitWeightKg: 100, ratePerUnit: 5650 },
  { crop: 'मसूर', unit: 'क्विंटल', unitWeightKg: 100, ratePerUnit: 6425 },
  { crop: 'सोयाबीन', unit: 'क्विंटल', unitWeightKg: 100, ratePerUnit: 4600 },
  { crop: 'मक्का', unit: 'क्विंटल', unitWeightKg: 100, ratePerUnit: 2090 },
];

const CENTRE_NAMES = [
  'Bhopal ABC खरीद केंद्र', 'Indore XYZ खरीद केंद्र', 'उज्जैन मंडी', 'सीहोर मुख्य केंद्र',
  'विदिशा किसान केंद्र', 'नर्मदापुरम खरीद मंडी', 'जबलपुर कृषि केंद्र', 'ग्वालियर स्मार्ट मंडी',
  'रीवा अन्न केंद्र', 'सागर उपज मंडी', 'देवास किसान सुविधा केंद्र', 'रतलाम खरीद केंद्र',
  'होशंगाबाद मंडी', 'इटारसी खरीद केंद्र', 'सीहोर गल्ला मंडी', 'Bhopal नया खरीद केंद्र',
  'Indore स्मार्ट मंडी', 'उज्जैन उपज केंद्र', 'विदिशा गल्ला मंडी', 'जबलपुर नया केंद्र',
  'ग्वालियर खरीद केंद्र 2', 'रीवा सुपर मंडी', 'सागर किसान केंद्र', 'रतलाम गल्ला मंडी'
];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); }

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Set MONGODB_URI in backend/.env before seeding.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB. Seeding MP data...');

  // 1. Seed Crops
  await Promise.all(
    CROPS.map((r) => CropRate.findOneAndUpdate({ crop: r.crop }, { $setOnInsert: r }, { upsert: true }))
  );

  // 2. Seed Staff Accounts
  const passHash = await bcrypt.hash('password123', 10);
  
  await Staff.findOneAndUpdate({ username: 'sysadmin' }, { $setOnInsert: { name: 'System Admin', username: 'sysadmin', passwordHash: passHash, role: 'system_admin' } }, { upsert: true });
  await Staff.findOneAndUpdate({ username: 'stateadmin' }, { $setOnInsert: { name: 'State Admin', username: 'stateadmin', passwordHash: passHash, role: 'state_admin' } }, { upsert: true });
  await Staff.findOneAndUpdate({ username: 'districtadmin' }, { $setOnInsert: { name: 'Bhopal District Admin', username: 'districtadmin', passwordHash: passHash, role: 'district_admin', district: 'Bhopal' } }, { upsert: true });
  await Staff.findOneAndUpdate({ username: 'centreadmin' }, { $setOnInsert: { name: 'Centre Admin 1', username: 'centreadmin', passwordHash: passHash, role: 'centre_admin' } }, { upsert: true });

  // 3. Seed Centres (~24)
  const centreDocs = [];
  for (let i = 0; i < CENTRE_NAMES.length; i++) {
    const district = MP_DISTRICTS[i % MP_DISTRICTS.length];
    let centre = await Centre.findOne({ name: CENTRE_NAMES[i] });
    if (!centre) {
      centre = await Centre.create({
        name: CENTRE_NAMES[i],
        codePrefix: `MP-${district.substring(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
        state: 'Madhya Pradesh',
        district: district,
        tehsil: `${district} Tehsil`,
        village: `${district} Village`,
        address: `Main Market, ${district}`,
        location: {
          latitude: 23.2599 + (Math.random() - 0.5),
          longitude: 77.4126 + (Math.random() - 0.5)
        },
        activeWeighingCounters: randomNumber(1, 5),
        labourOnDuty: randomNumber(5, 20),
        storageLeftCapacity: randomNumber(100, 5000),
        averageServiceTimeMinutes: randomNumber(10, 30),
        openingTime: '08:00',
        closingTime: '18:00',
        capacityPerSlot: 20,
        crops: CROPS.map(c => ({ name: c.crop, maxQuantity: null }))
      });
    }
    centreDocs.push(centre);
  }

  // Link centreadmin to first centre
  if (centreDocs.length > 0) {
    await Staff.findOneAndUpdate({ username: 'centreadmin' }, { centre: centreDocs[0]._id });
  }

  // 4. Seed Farmers (~300)
  const farmerCount = await Farmer.countDocuments();
  const farmerDocs = [];
  if (farmerCount < 300) {
    console.log('Generating Farmers...');
    const hindiNames = ['राम', 'श्याम', 'राधा', 'मोहन', 'गीता', 'हरी', 'सीता', 'सुनील', 'अमित', 'सुषमा', 'रमेश', 'महेश', 'राजेश', 'सुरेश', 'संजय', 'कमलेश', 'दिनेश', 'मुकेश', 'राजू', 'वीरेंद्र'];
    const surnames = ['शर्मा', 'वर्मा', 'यादव', 'चौधरी', 'सिंह', 'पटेल', 'पाटीदार', 'राजपूत', 'कुशवाहा', 'मीना'];
    
    for (let i = 0; i < 300 - farmerCount; i++) {
      const name = `${randomItem(hindiNames)} ${randomItem(surnames)}`;
      const mobileNumber = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
      const district = randomItem(MP_DISTRICTS);
      const isVerified = Math.random() > 0.1;
      
      const farmer = await Farmer.create({
        name,
        mobileNumber,
        preferredLanguage: 'hi',
        district,
        tehsil: `${district} Tehsil`,
        village: `${district} Village`,
        pincode: '462001',
        aadharLast4: Math.floor(1000 + Math.random() * 9000).toString(),
        aadharVerified: isVerified,
        landDistrict: district,
        landTehsil: `${district} Tehsil`,
        landVillage: `${district} Village`,
        khasraNumber: `K-${Math.floor(Math.random() * 10000)}`,
        landAreaHectares: Math.round((0.5 + Math.random() * 10) * 100) / 100,
        landVerificationStatus: isVerified ? 'verified' : (Math.random() > 0.5 ? 'pending' : 'manual_review'),
        cropEligibility: [randomItem(CROPS).crop, randomItem(CROPS).crop],
        bankValidationStatus: isVerified ? 'verified' : 'pending',
        profileStatus: isVerified ? 'active' : 'pending_review',
        preferredCentres: [randomItem(centreDocs)._id]
      });
      farmerDocs.push(farmer);
    }
  } else {
    farmerDocs.push(...await Farmer.find().limit(300));
  }
  
  // Ensure Demo Farmer
  await Farmer.findOneAndUpdate(
    { mobileNumber: '1234567890' },
    {
      $setOnInsert: {
        name: 'Demo Farmer',
        mobileNumber: '1234567890',
        preferredLanguage: 'hi',
        district: 'Bhopal',
        tehsil: 'Bhopal Tehsil',
        village: 'Bhopal Village',
        pincode: '462001',
        aadharLast4: '1234',
        aadharVerified: true,
        landDistrict: 'Bhopal',
        landTehsil: 'Bhopal Tehsil',
        landVillage: 'Bhopal Village',
        khasraNumber: 'K-1234',
        landAreaHectares: 5.0,
        landVerificationStatus: 'verified',
        cropEligibility: ['गेहूं', 'धान'],
        bankValidationStatus: 'verified',
        profileStatus: 'active',
        preferredCentres: [centreDocs[0]._id]
      }
    },
    { upsert: true }
  );
  
  const demoFarmer = await Farmer.findOne({ mobileNumber: '1234567890' });
  if (demoFarmer && !farmerDocs.find(f => f._id.equals(demoFarmer._id))) {
      farmerDocs.push(demoFarmer);
  }

  // 5. Seed Slots and Bookings (~1200)
  const bookingCount = await Booking.countDocuments();
  if (bookingCount < 1200) {
    console.log('Generating Bookings...');
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Generate dates: from 10 days ago to 5 days ahead
    const dates = [];
    for (let i = -10; i <= 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    
    const STAGES = Booking.PROCUREMENT_STAGES;
    const PAYMENT_STATUSES = ['not_applicable', 'pending', 'processing', 'failed', 'credited'];
    
    for (let i = 0; i < 1200 - bookingCount; i++) {
      const centre = randomItem(centreDocs);
      const farmer = randomItem(farmerDocs);
      const date = randomItem(dates);
      
      // Create a slot if not exists (mock simple slot)
      let slot = await Slot.findOne({ centre: centre._id, date });
      if (!slot) {
        slot = await Slot.create({
          centre: centre._id,
          date,
          startTime: '08:00',
          endTime: '12:00',
          capacity: centre.capacityPerSlot,
          bookedCount: 0
        });
      }
      
      const crop = randomItem(CROPS);
      const isPast = new Date(date) < today;
      const isToday = date === today.toISOString().split('T')[0];
      
      // Determine stage
      let stage = STAGES[0];
      let queueStatus = 'waiting';
      let paymentStatus = 'not_applicable';
      let advisorState = 'NORMAL';
      
      if (isPast) {
        stage = Math.random() > 0.1 ? 'payment_credited' : 'payment_processing';
        queueStatus = 'completed';
        paymentStatus = stage === 'payment_credited' ? 'credited' : 'processing';
      } else if (isToday) {
        stage = randomItem(STAGES.slice(0, 6)); // up to rejected
        queueStatus = ['accepted', 'rejected'].includes(stage) ? 'completed' : 'processing';
        advisorState = randomItem(['GO', 'WAIT', 'RESCHEDULE', 'NORMAL']);
      } else {
        stage = 'slot_booked';
        queueStatus = 'waiting';
        advisorState = randomItem(['GO', 'WAIT', 'NORMAL']);
      }
      
      const quantity = Math.floor(Math.random() * 50) + 10;
      const estimatedValue = quantity * crop.ratePerUnit;
      
      await Booking.create({
        token: `${centre.codePrefix}-${date.replace(/-/g, '')}-${crop.crop}-S${slot._id.toString().substring(0,4).toUpperCase()}-Q${i}`,
        farmer: farmer._id,
        centre: centre._id,
        slot: slot._id,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        queueStatus,
        procurementStage: stage,
        advisorState,
        advisorReason: advisorState !== 'NORMAL' ? 'यह एक सिस्टम जनरेटेड सलाह है।' : null,
        crop: crop.crop,
        unit: crop.unit,
        plannedQuantity: quantity,
        numberOfBags: quantity,
        quantity: ['weighing', 'quality_check', 'accepted', 'payment_processing', 'payment_credited'].includes(stage) ? quantity : null,
        officialRatePerUnit: crop.ratePerUnit,
        estimatedValue,
        dailyQueueNumber: i,
        paymentStatus,
        paidAmount: paymentStatus === 'credited' ? estimatedValue : null,
        stageTimeline: [
          { stage: 'slot_booked', timestamp: new Date(new Date(date).getTime() - 86400000 * 2) }
        ]
      });
      
      await Slot.updateOne({ _id: slot._id }, { $inc: { bookedCount: 1 } });
    }
  }

  console.log('Seed complete.');
  console.log('  Sysadmin login    -> username: sysadmin       password: password123');
  console.log('  State Admin       -> username: stateadmin     password: password123');
  console.log('  District Admin    -> username: districtadmin  password: password123');
  console.log('  Centre Admin      -> username: centreadmin    password: password123');
  console.log('  Demo farmer       -> mobile: 1234567890       (OTP: 123456)');
  
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
