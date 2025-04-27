const axios = require('axios');
const crypto = require('crypto');
const billplzConfig = require('../config/billplz');
const { Payment, Booking } = require('../models');

/**
 * Service for handling Billplz payment integration
 */
class PaymentService {
  /**
   * Create a new bill in Billplz
   * @param {Object} bookingData - Booking data
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Payment details with Billplz URL
   */
  async createBill(bookingData, userData) {
    try {
      // Create basic auth header for Billplz API
      const auth = Buffer.from(billplzConfig.apiKey + ':').toString('base64');
      
      // Prepare bill data
      const billData = {
        collection_id: billplzConfig.collectionId,
        email: userData.email,
        name: userData.fullName,
        amount: Math.round(bookingData.amount * 100), // Convert to cents
        callback_url: billplzConfig.callbackUrl,
        redirect_url: billplzConfig.redirectUrl,
        description: `Booking #${bookingData.id} - ${bookingData.slotDetails}`,
        reference_1_label: "Booking ID",
        reference_1: bookingData.id.toString(),
        reference_2_label: "User ID",
        reference_2: userData.id.toString()
      };
      
      // Call Billplz API to create bill
      const response = await axios.post(`${billplzConfig.baseUrl}/bills`, billData, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Extract bill data from response
      const { id: billplzBillId, url: billplzUrl } = response.data;
      
      // Save payment record in database
      const payment = await Payment.create({
        bookingId: bookingData.id,
        userId: userData.id,
        billplzBillId,
        amount: bookingData.amount,
        status: 'pending',
        billplzUrl,
        billplzResponse: response.data
      });
      
      // Update booking with payment ID
      await Booking.update(
        { paymentId: payment.id, paymentStatus: 'pending' },
        { where: { id: bookingData.id } }
      );
      
      return {
        paymentId: payment.id,
        billplzBillId,
        billplzUrl,
        status: 'pending'
      };
    } catch (error) {
      console.error('Error creating Billplz bill:', error);
      throw new Error('Failed to create payment bill');
    }
  }
  
  /**
   * Verify webhook signature from Billplz
   * @param {Object} headers - Request headers
   * @param {Object} body - Request body
   * @returns {Boolean} - Whether signature is valid
   */
  verifyWebhookSignature(headers, body) {
    try {
      const xSignature = headers['x-signature'];
      if (!xSignature) return false;
      
      // Create HMAC signature with body content
      const hmac = crypto.createHmac('sha256', billplzConfig.xSignatureKey);
      hmac.update(JSON.stringify(body));
      const computedSignature = hmac.digest('hex');
      
      // Compare signatures
      return xSignature === computedSignature;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }
  
  /**
   * Process payment webhook from Billplz
   * @param {Object} webhookData - Webhook data from Billplz
   * @returns {Promise<Object>} - Updated payment details
   */
  async processWebhook(webhookData) {
    try {
      const { id, state, paid } = webhookData;
      
      // Find the payment by Billplz bill ID
      const payment = await Payment.findOne({
        where: { billplzBillId: id }
      });
      
      if (!payment) {
        throw new Error(`Payment not found for bill ${id}`);
      }
      
      // Update payment status based on webhook data
      let status;
      if (paid === 'true' || paid === true) {
        status = 'completed';
      } else if (state === 'due') {
        status = 'pending';
      } else {
        status = 'failed';
      }
      
      // Update payment record
      await payment.update({
        status,
        paymentMethod: webhookData.payment_method || null,
        paymentDate: paid ? new Date() : null,
        billplzResponse: {
          ...payment.billplzResponse,
          webhookData
        }
      });
      
      // Update associated booking
      await Booking.update(
        { paymentStatus: status },
        { where: { id: payment.bookingId } }
      );
      
      return {
        paymentId: payment.id,
        billplzBillId: id,
        status
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new Error('Failed to process payment webhook');
    }
  }
  
  /**
   * Check payment status directly from Billplz
   * @param {String} billplzBillId - Billplz bill ID
   * @returns {Promise<Object>} - Payment status from Billplz
   */
  async checkPaymentStatus(billplzBillId) {
    try {
      // Create basic auth header for Billplz API
      const auth = Buffer.from(billplzConfig.apiKey + ':').toString('base64');
      
      // Call Billplz API to get bill status
      const response = await axios.get(`${billplzConfig.baseUrl}/bills/${billplzBillId}`, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Failed to check payment status');
    }
  }
}

module.exports = new PaymentService(); 