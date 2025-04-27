const express = require('express');
const { Booking, Lot, User } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (admin only)
// @access  Private/Admin
router.get('/', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, attributes: ['id', 'fullName', 'email'] },
        { model: Lot, attributes: ['id', 'lotNumber', 'location'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/bookings/user
// @desc    Get user bookings
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Lot, attributes: ['id', 'lotNumber', 'location'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { fullName, phoneNumber, carPlate, address, itemType, itemDescription, bookingDate } = req.body;
    
    const booking = await Booking.create({
      fullName,
      phoneNumber,
      carPlate,
      address,
      itemType,
      itemDescription,
      bookingDate,
      userId: req.user.id
    });
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (admin only)
// @access  Private/Admin
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, lotId } = req.body;
    
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: User }]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update booking status
    booking.status = status;
    
    // If approved, assign a lot
    if (status === 'approved' && lotId) {
      const lot = await Lot.findByPk(lotId);
      
      if (!lot || lot.status !== 'available') {
        return res.status(400).json({ message: 'Selected lot is not available' });
      }
      
      booking.lotId = lotId;
      booking.lotNumber = lot.lotNumber;
      
      // Update lot status
      lot.status = 'booked';
      await lot.save();
    }
    
    await booking.save();
    
    // Send email notification
    if (!booking.emailSent && booking.status !== 'pending') {
      const emailStatus = booking.status === 'approved' ? 'Approved' : 'Rejected';
      const lotInfo = booking.status === 'approved' ? `Your assigned lot number is: ${booking.lotNumber}` : '';
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.user.email,
        subject: `Carboot Booking ${emailStatus}`,
        html: `
          <h1>Booking ${emailStatus}</h1>
          <p>Hello ${booking.fullName},</p>
          <p>Your booking for ${booking.bookingDate} has been ${booking.status}.</p>
          <p>${lotInfo}</p>
          <p>Thank you for using our service!</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
      booking.emailSent = true;
      await booking.save();
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check user owns booking or is admin
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // If booking has a lot, free it up
    if (booking.lotId) {
      const lot = await Lot.findByPk(booking.lotId);
      if (lot) {
        lot.status = 'available';
        await lot.save();
      }
    }
    
    await booking.destroy();
    
    res.json({ message: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 