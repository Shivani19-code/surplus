const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'restaurant'], default: 'student' },
  
  // NEW: Address field (Optional for students, Required for Restaurants)
  address: { type: String, default: '' } 
});

module.exports = mongoose.model('User', UserSchema);