const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// 1. Toggle Favorite (Add or Remove)
router.post('/toggle', async (req, res) => {
  const { studentId, listingId } = req.body;
  try {
    // Check if already liked
    const existing = await Favorite.findOne({ studentId, listingId });
    
    if (existing) {
      // If yes, delete it (Unlike)
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ status: 'removed' });
    } else {
      // If no, create it (Like)
      const newFav = new Favorite({ studentId, listingId });
      await newFav.save();
      return res.json({ status: 'added' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get User's Favorites (To show the red hearts)
router.get('/:userId', async (req, res) => {
  try {
    const favs = await Favorite.find({ studentId: req.params.userId }).populate('listingId');
    res.json(favs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;