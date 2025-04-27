# Integration Plan for Carboot Booking System

This document outlines the steps required to implement the features described in the system design document into the existing codebase.

## 1. Database Schema Updates

### Existing Models
The application currently has these models:
- User
- Booking 
- Lot

### Required New Models
Based on the system design, the following new models need to be created:

1. **Event** (replaces/extends existing Lot model)
   - Create a new model for carboot events
   - Migrate data from Lot to Event if necessary

2. **Slot** (new model)
   - Create to represent individual slots at events
   - Update existing Booking model to reference Slot instead of Lot

3. **Vendor** (new model)
   - Create for vendor management

4. **Payment** (new model)
   - Create for tracking payments via Billplz
   - Link to Booking model

5. **Notification** (new model)
   - Create for tracking all system notifications

### Steps:
1. Create new model files in `/models` directory
2. Update `models/index.js` to include new relationships
3. Create migration scripts for database schema changes

## 2. Backend API Enhancements

### Existing Routes
- `/api/auth` - User authentication
- `/api/bookings` - Booking management
- `/api/lots` - Lot management

### New Routes to Implement
1. **Events API**
   - Create `/routes/events.js` for event management
   - Implement CRUD operations

2. **Slots API**
   - Create `/routes/slots.js` for slot management
   - Implement availability checking and reservation

3. **Vendors API**
   - Create `/routes/vendors.js` for vendor management
   - Implement registration and profile management

4. **Payments API with Billplz Integration**
   - Create `/routes/payments.js` for payment processing
   - Implement Billplz webhook endpoints

5. **Notifications API**
   - Create `/routes/notifications.js` for notification management
   - Implement email/SMS sending functionality

### Steps:
1. Create new route files in `/routes` directory
2. Update `server.js` to use these routes
3. Create needed middleware for authentication and validation

## 3. Billplz Payment Gateway Integration

### Required Dependencies
```
npm install axios billplz-node --save
```

### Implementation Steps
1. Create a Billplz configuration in `/config/billplz.js`
2. Create a payment service in `/services/payment.js`:
   - Functions for creating bills
   - Functions for verifying payments
   - Functions for handling webhooks
3. Create webhook endpoint in `/routes/payments.js`
4. Update the booking process to integrate with payment flow

### Configuration Example for Billplz
```javascript
// config/billplz.js
module.exports = {
  apiKey: process.env.BILLPLZ_API_KEY,
  collectionId: process.env.BILLPLZ_COLLECTION_ID,
  xSignatureKey: process.env.BILLPLZ_X_SIGNATURE_KEY,
  sandbox: process.env.NODE_ENV !== 'production'
};
```

### .env File Updates
Add to .env file:
```
BILLPLZ_API_KEY=your_api_key
BILLPLZ_COLLECTION_ID=your_collection_id
BILLPLZ_X_SIGNATURE_KEY=your_signature_key
```

## 4. Frontend Enhancements (Client Directory)

### New Components to Create
1. **Event Components**
   - EventList, EventDetail, EventMap

2. **Booking Components**
   - SlotSelection, BookingWizard, PaymentRedirect, BookingConfirmation

3. **Vendor Components**
   - VendorRegistration, VendorDashboard, VendorProfile

4. **Admin Components**
   - EventManagement, UserManagement, ReportDashboard

5. **Payment Components**
   - PaymentForm, PaymentStatus, PaymentHistory

### Steps:
1. Create new component files in the client directory
2. Update React routes to include new pages
3. Create new Redux/Context actions and reducers for state management

## 5. Implementation Phases

### Phase 1: Core Updates (2-3 weeks)
1. Update database schema and models
2. Create basic CRUD APIs for new entities
3. Implement basic frontend components

### Phase 2: Billplz Integration (1-2 weeks)
1. Set up Billplz account and API keys
2. Implement payment processing backend
3. Create payment flow in frontend

### Phase 3: Advanced Features (2-3 weeks)
1. Implement notification system
2. Add vendor management
3. Create advanced booking features (waitlists, early-bird pricing)

### Phase 4: Security & Optimization (1-2 weeks)
1. Implement security enhancements
2. Add caching and performance optimizations
3. Testing and bug fixes

## 6. Required Environment Variables

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=carboot_db

# JWT Authentication
JWT_SECRET=your_secret_key

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Billplz Payment Gateway
BILLPLZ_API_KEY=your_api_key
BILLPLZ_COLLECTION_ID=your_collection_id
BILLPLZ_X_SIGNATURE_KEY=your_signature_key
BILLPLZ_CALLBACK_URL=http://localhost:5000/api/payments/webhook
```

## 7. Testing Strategy

1. **Unit Tests**
   - Test model methods and validations
   - Test API route handlers
   - Test payment processing functions

2. **Integration Tests**
   - Test API endpoints
   - Test database operations
   - Test Billplz integration

3. **End-to-End Tests**
   - Test complete booking flow
   - Test payment process
   - Test admin functions

## 8. Deployment Considerations

1. **Database Migrations**
   - Create proper migration scripts
   - Test migrations on staging environment

2. **Environment Setup**
   - Ensure all environment variables are set
   - Configure production database

3. **Monitoring**
   - Implement logging
   - Set up error tracking
   - Monitor payment processing 