const Centre = require('../models/Centre');
const WaitTimePredictor = require('./WaitTimePredictor');

// Simple distance heuristic (Euclidean for prototype)
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 111; // Rough km conversion
}

class FastestCentreRecommender {
  static async getRecommendations(farmerLat, farmerLon, crop, requiredQuantity) {
    const activeCentres = await Centre.find({ status: 'Open', isActive: true });
    
    let recommendations = [];
    for (const centre of activeCentres) {
      const cropSupport = centre.crops.find(c => c.name === crop);
      if (!cropSupport) continue;
      
      const distanceKm = calculateDistance(farmerLat, farmerLon, centre.location?.latitude, centre.location?.longitude);
      if (distanceKm > 100) continue; // Skip very far centres

      const waitMinutes = await WaitTimePredictor.predictForCentre(centre._id);
      
      // Heuristic score: Distance takes time (e.g. 1 hour per 40km) + Wait time
      const travelTimeMinutes = (distanceKm / 40) * 60;
      const totalEtaMinutes = travelTimeMinutes + waitMinutes;
      
      recommendations.push({
        centreId: centre._id,
        name: centre.name,
        district: centre.district,
        distanceKm: Math.round(distanceKm),
        predictedWaitMinutes: waitMinutes,
        totalEtaMinutes: Math.round(totalEtaMinutes),
        capacityLeft: centre.storageLeftCapacity
      });
    }

    // Sort by total ETA ascending
    recommendations.sort((a, b) => a.totalEtaMinutes - b.totalEtaMinutes);
    return recommendations.slice(0, 5); // Top 5
  }
}

module.exports = FastestCentreRecommender;
