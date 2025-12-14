const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pickupTime: { type: String, required: true },
  
  // --- NEW FIELD: CATEGORY ---
  category: { 
    type: String, 
    enum: ['food', 'electronics', 'clothing', 'other'], // Only allows these values
    default: 'food' // If an old item has no category, assume it is food
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);