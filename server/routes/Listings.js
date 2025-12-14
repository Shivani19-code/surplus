const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing'); // This imports the model you already made

// 1. GET ALL FOOD (For Student Home Page)
router.get('/all', async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('restaurantId', 'name email address'); // <--- ADD 'address' HERE
      
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADD FOOD (For Restaurant Dashboard)
router.post('/add', async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        res.status(201).json({ message: "Listing added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE LISTING (For Restaurant to remove items)
router.delete('/delete/:id', async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: "Listing deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DECREASE QUANTITY (Remove specific count)
router.put('/decrease/:id', async (req, res) => {
  try {
    const { count } = req.body; // How many to remove
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ error: "Item not found" });

    // Subtract the count
    listing.quantity -= count;

    // Safety: Don't let it go below 0
    if (listing.quantity < 0) listing.quantity = 0;

    await listing.save();
    res.json({ message: "Quantity updated", listing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;