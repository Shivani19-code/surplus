// FILE: server/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Listing = require('../models/Listing');

// 1. PLACE ORDER (You already have this working)
// 1. PLACE ORDER
router.post('/place', async (req, res) => {
  try {
    const { studentId, listingId, restaurantId, price, itemTitle } = req.body; // <--- Expect itemTitle

    const newOrder = new Order({
      studentId,
      listingId,
      restaurantId,
      totalPrice: price,
      itemTitle: itemTitle, // <--- Save it!
      status: 'ordered'
    });

    await newOrder.save();

    // Decrease quantity in the Listing
    // We use findByIdAndUpdate just to be safe if listing exists
    const Listing = require('../models/Listing');
    const listing = await Listing.findById(listingId);
    if (listing) {
        listing.quantity = Math.max(0, listing.quantity - 1);
        await listing.save();
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET ORDERS (THIS IS THE FIX)
// This route fetches orders and "populates" the details
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ studentId: req.params.userId })
      .populate('listingId')      // Converts listingId -> Full Food Details
      .populate('restaurantId');  // Converts restaurantId -> Full Restaurant Details
      
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET RESTAURANT ORDERS (Sales History)
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId })
      .populate('listingId')      // Get the Food Name
      .populate('studentId', 'name email'); // Get the Student's Name & Email (Important for pickup!)
      
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET RESTAURANT ORDERS (Sales History)
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId })
      .populate('listingId')      // Get the Food Name
      .populate('studentId', 'name email'); // Get the Student's Name & Email
      
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE ORDER STATUS (Mark as Picked Up)
router.put('/status/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.orderId, { status });
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;