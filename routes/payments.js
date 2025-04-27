const express = require('express');
const { auth } = require('../middleware/auth');
const paymentService = require('../services/payment');
const { Payment, Booking, User } = require('../models');
const router = express.Router();

/**
 * @route   POST /api/payments/create
 * @desc    Create a new payment for a booking
 * @access  Private
 */
router.post('/create', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    // Find the booking
    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking belongs to the authenticated user
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to make payment for this booking' });
    }
    
    // Check if booking already has a payment
    if (booking.paymentId) {
      const existingPayment = await Payment.findByPk(booking.paymentId);
      
      // If payment exists and is pending, return the existing payment URL
      if (existingPayment && existingPayment.status === 'pending') {
        return res.json({
          paymentId: existingPayment.id,
          billplzBillId: existingPayment.billplzBillId,
          billplzUrl: existingPayment.billplzUrl,
          status: existingPayment.status
        });
      }
    }
    
    // Get user data for payment
    const user = await User.findByPk(req.user.id);
    
    // Prepare booking data for payment
    const bookingData = {
      id: booking.id,
      amount: booking.amount,
      slotDetails: `Carboot Slot Booking` // You can enhance this with event and slot details
    };
    
    // Create payment bill
    const paymentData = await paymentService.createBill(bookingData, user);
    
    res.json(paymentData);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment details
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if payment belongs to the authenticated user
    if (payment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Billplz webhook
 * @access  Public
 */
router.post('/webhook', async (req, res) => {
  try {
    // Verify webhook signature
    const isValid = paymentService.verifyWebhookSignature(req.headers, req.body);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid webhook signature' });
    }
    
    // Process the webhook data
    const result = await paymentService.processWebhook(req.body);
    
    res.json({ message: 'Webhook processed successfully', ...result });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/payments/status/:billId
 * @desc    Check payment status
 * @access  Private
 */
router.get('/status/:billId', auth, async (req, res) => {
  try {
    // Check status from Billplz
    const billplzStatus = await paymentService.checkPaymentStatus(req.params.billId);
    
    // Find payment in database
    const payment = await Payment.findOne({
      where: { billplzBillId: req.params.billId }
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if payment belongs to the authenticated user
    if (payment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to check this payment status' });
    }
    
    res.json({
      payment,
      billplzStatus
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 