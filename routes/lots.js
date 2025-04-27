const express = require('express');
const { Lot, Booking } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/lots
// @desc    Get all lots
// @access  Public
router.get('/', async (req, res) => {
  try {
    const lots = await Lot.findAll({
      order: [['lotNumber', 'ASC']]
    });
    res.json(lots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/lots/available
// @desc    Get available lots
// @access  Public
router.get('/available', async (req, res) => {
  try {
    const lots = await Lot.findAll({
      where: { status: 'available' },
      order: [['lotNumber', 'ASC']]
    });
    res.json(lots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/lots/:id
// @desc    Get lot by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const lot = await Lot.findByPk(req.params.id);
    
    if (!lot) {
      return res.status(404).json({ message: 'Lot not found' });
    }
    
    res.json(lot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/lots
// @desc    Create a lot (admin only)
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
  try {
    const { lotNumber, location, size, price } = req.body;
    
    // Check if lot exists
    let lot = await Lot.findOne({ where: { lotNumber } });
    
    if (lot) {
      return res.status(400).json({ message: 'Lot already exists' });
    }
    
    // Create lot
    lot = await Lot.create({
      lotNumber,
      location,
      size,
      price
    });
    
    res.json(lot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/lots/:id
// @desc    Update a lot (admin only)
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { lotNumber, status, location, size, price } = req.body;
    
    const lot = await Lot.findByPk(req.params.id);
    
    if (!lot) {
      return res.status(404).json({ message: 'Lot not found' });
    }
    
    // If changing lot number, check it doesn't already exist
    if (lotNumber && lotNumber !== lot.lotNumber) {
      const existingLot = await Lot.findOne({ where: { lotNumber } });
      
      if (existingLot) {
        return res.status(400).json({ message: 'Lot number already exists' });
      }
    }
    
    // Update lot
    await lot.update({
      lotNumber: lotNumber || lot.lotNumber,
      status: status || lot.status,
      location: location || lot.location,
      size: size || lot.size,
      price: price || lot.price
    });
    
    // If status changed to unavailable and was booked, update any bookings
    if (lot.status === 'unavailable' && lot.previous('status') === 'booked') {
      await Booking.update(
        { 
          status: 'rejected',
          lotId: null,
          lotNumber: null
        },
        { where: { lotId: lot.id } }
      );
    }
    
    res.json(lot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/lots/:id
// @desc    Delete a lot (admin only)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const lot = await Lot.findByPk(req.params.id);
    
    if (!lot) {
      return res.status(404).json({ message: 'Lot not found' });
    }
    
    // Check if lot is booked
    const booking = await Booking.findOne({ where: { lotId: lot.id } });
    
    if (booking) {
      return res.status(400).json({ message: 'Cannot delete lot that is currently booked' });
    }
    
    await lot.destroy();
    
    res.json({ message: 'Lot removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/lots/generate
// @desc    Generate multiple lots (admin only)
// @access  Private/Admin
router.post('/generate', adminAuth, async (req, res) => {
  try {
    const { prefix, start, end, location, size, price } = req.body;
    
    if (!prefix || start === undefined || end === undefined) {
      return res.status(400).json({ message: 'Please provide prefix, start and end values' });
    }
    
    const createdLots = [];
    const errors = [];
    
    for (let i = start; i <= end; i++) {
      const lotNumber = `${prefix}${i}`;
      
      // Check if lot exists
      const existingLot = await Lot.findOne({ where: { lotNumber } });
      
      if (existingLot) {
        errors.push(`Lot ${lotNumber} already exists`);
        continue;
      }
      
      // Create lot
      const lot = await Lot.create({
        lotNumber,
        location,
        size,
        price
      });
      
      createdLots.push(lot);
    }
    
    res.json({ 
      message: `Created ${createdLots.length} lots`,
      totalCreated: createdLots.length,
      errors
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 