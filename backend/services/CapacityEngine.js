const Centre = require('../models/Centre');
const Slot = require('../models/Slot');

class CapacityEngine {
  /**
   * Calculates the true capacity of a slot based on current centre resources.
   * Formula: (Slot Duration / Avg Service Time) * Active Weighing Counters
   * Penalized if labour is low or storage is running out.
   */
  static async calculateDynamicCapacity(centreId, slotDurationMinutes) {
    const centre = await Centre.findById(centreId);
    if (!centre) throw new Error('Centre not found');

    const baseCapacity = (slotDurationMinutes / centre.averageServiceTimeMinutes) * centre.activeWeighingCounters;
    
    // Penalize if labour is insufficient (assume we need 3 labour per counter)
    const requiredLabour = centre.activeWeighingCounters * 3;
    const labourFactor = centre.labourOnDuty >= requiredLabour ? 1 : centre.labourOnDuty / requiredLabour;
    
    // Check storage bottleneck (e.g. if less than 50 tons, severely limit)
    const storageFactor = centre.storageLeftCapacity < 50 ? 0.5 : 1;

    const dynamicCapacity = Math.floor(baseCapacity * labourFactor * storageFactor);
    return Math.max(1, dynamicCapacity); // At least 1
  }

  static async applyDynamicCapacityToSlots(centreId, date) {
    const slots = await Slot.find({ centre: centreId, date });
    if (slots.length === 0) return;
    
    const centre = await Centre.findById(centreId);
    for (const slot of slots) {
      const dynamicCap = await this.calculateDynamicCapacity(centreId, centre.slotDurationMinutes);
      slot.capacity = dynamicCap;
      await slot.save();
    }
  }
}

module.exports = CapacityEngine;
