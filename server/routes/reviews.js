const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// 1. Add a Review
router.post('/add', async (req, res) => {
  try {
    const { studentId, restaurantId, orderId, rating, comment } = req.body;
    
    // Create new review
    const newReview = new Review({ studentId, restaurantId, orderId, rating, comment });
    await newReview.save();
    
    res.status(201).json({ message: "Review added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Reviews for a Restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId })
      .populate('studentId', 'name'); // Show who wrote it
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;