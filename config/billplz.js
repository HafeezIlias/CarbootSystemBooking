/**
 * Billplz Payment Gateway Configuration
 * 
 * This file contains configuration settings for integration with the Billplz payment gateway.
 * Make sure to set the corresponding environment variables in your .env file.
 * 
 * For development, you can use Billplz sandbox mode by setting NODE_ENV to anything other than 'production'.
 */

module.exports = {
  // API Key from Billplz dashboard
  apiKey: process.env.BILLPLZ_API_KEY,
  
  // Collection ID for your Billplz account
  collectionId: process.env.BILLPLZ_COLLECTION_ID,
  
  // X-Signature Key for validating webhook calls
  xSignatureKey: process.env.BILLPLZ_X_SIGNATURE_KEY,
  
  // API URL - automatically selects sandbox or production
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://www.billplz.com/api/v3' 
    : 'https://www.billplz-sandbox.com/api/v3',
  
  // Sandbox mode
  sandbox: process.env.NODE_ENV !== 'production',
  
  // Callback URLs
  callbackUrl: process.env.BILLPLZ_CALLBACK_URL || 'http://localhost:5000/api/payments/webhook',
  
  // Redirect URLs
  redirectUrl: process.env.BILLPLZ_REDIRECT_URL || 'http://localhost:3000/payment/status'
}; 