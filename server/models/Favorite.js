const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);