# Carboot Booking System - System Design

## 1. Main Components

### User Module
- Registration & Login
- Profile Management
- View available carboot events
- Book slot
- Payment for slot
- Booking history
- **Favorite events management**
- **Vehicle information management**
- **Digital receipts & invoices**
- **Booking cancellation requests**

### Admin Module
- Manage carboot events (Create, Update, Delete events)
- Manage slots (Number of slots, prices, time, location)
- View and manage bookings
- Manage users
- Reports (sales, bookings)
- **Vendor management**
- **Discount code management**
- **Refund processing**
- **Event analytics dashboard**
- **Staff account management with role-based permissions**

### Carboot Event Module
- Event details (date, time, location, slot capacity)
- Slot status (available/booked)
- Event images, terms & conditions
- **Event categories and tags**
- **Weather contingency information**
- **Amenities list (toilets, food vendors, parking)**
- **Event-specific rules and regulations**
- **Interactive venue map**

### Booking Module
- Real-time slot availability
- Slot selection and reservation
- Payment gateway integration (Billplz)
- Confirmation and receipt
- **Early-bird pricing tiers**
- **Group booking discounts**
- **Booking modification options**
- **Waitlist functionality for sold-out events**
- **Multi-slot booking capability**

### Notification Module
- Email/SMS/Push notifications (Booking confirmation, event reminders, etc.)
- **Customizable notification preferences**
- **Automated booking reminders**
- **Payment reminders for pending transactions**
- **Event updates and changes**
- **Promotional notifications**

### **Vendor Module**
- **Vendor registration and profile**
- **Product/merchandise categories**
- **Slot history and preferences**
- **Sales reporting**
- **Vendor ratings and reviews**

### **Payment Module**
- **Billplz payment gateway integration**
- **Payment status tracking**
- **Multiple payment methods (via Billplz)**
- **Automatic invoicing**
- **Refund processing**
- **Payment analytics**

## 2. Database Structure (Simplified)

### Users Table
- user_id (PK)
- full_name
- email
- password (hashed)
- phone_number
- address
- role (user/admin)
- created_at
- updated_at

### Events Table
- event_id (PK)
- event_name
- description
- location
- event_date
- start_time
- end_time
- image_url
- terms_conditions
- status (upcoming/active/completed/canceled)
- created_by
- created_at
- updated_at

### Slots Table
- slot_id (PK)
- event_id (FK)
- slot_number
- price
- size
- location_description
- status (available/reserved/booked/canceled)
- created_at
- updated_at

### Bookings Table
- booking_id (PK)
- user_id (FK)
- slot_id (FK)
- booking_date
- status (pending/confirmed/canceled/completed)
- payment_status
- payment_id
- amount
- discount_code
- created_at
- updated_at

### Payments Table
- payment_id (PK)
- booking_id (FK)
- user_id (FK)
- billplz_bill_id
- amount
- status (pending/completed/failed/refunded)
- payment_method
- transaction_id
- payment_date
- created_at
- updated_at

### Vendors Table
- vendor_id (PK)
- user_id (FK)
- business_name
- business_description
- product_categories
- contact_person
- created_at
- updated_at

### Notifications Table
- notification_id (PK)
- user_id (FK)
- title
- message
- type (email/sms/push)
- status (sent/failed)
- read_status
- created_at

## 3. System Flow (High Level)

1. User Registration/Login
   - New users register with email, password, and basic details
   - Returning users login with credentials
   - Social login options available

2. User browses list of available carboot events
   - Filter by date, location, price
   - View event details, rules, amenities
   - Check interactive venue map

3. User selects event and sees available slots
   - Real-time availability status
   - Slot pricing information
   - Slot location within venue

4. User selects a slot and proceeds to payment
   - System holds the slot temporarily (15 minutes)
   - User is redirected to Billplz payment gateway
   - Multiple payment options through Billplz (credit/debit card, online banking)

5. System confirms booking after successful payment
   - Digital receipt is generated
   - Booking details are saved
   - Confirmation email/SMS is sent to the user

6. Admin monitors and manages bookings via dashboard
   - Real-time booking statistics
   - Manage slot allocations
   - Process refund requests if needed

7. System sends notifications (confirmation, reminder before event day)
   - Automated booking confirmation
   - 3-day reminder before the event
   - Updates on any changes to the event

8. **Vendor management process**
   - Vendors register and create profiles
   - Admin approves vendor applications
   - Vendors can book specialized vendor slots

9. **Post-event process**
   - System automatically marks bookings as completed
   - Users can provide feedback and ratings
   - Analytics data is compiled for admin review

## 4. Billplz Payment Gateway Integration

### Integration Process
1. Create a Billplz account and get API credentials
2. Implement Billplz API in the booking system
3. Create payment collection in Billplz dashboard
4. Configure webhook URLs for payment notifications

### Payment Flow
1. User confirms slot selection and proceeds to checkout
2. System creates a bill in Billplz with booking details
3. User is redirected to Billplz payment page
4. User selects payment method (FPX online banking, credit/debit cards)
5. After payment, Billplz redirects user back to the booking system
6. System verifies payment status via Billplz webhook
7. Booking is confirmed if payment is successful

### Billplz Features Used
- Payment collection
- Multiple payment methods
- Payment callbacks
- Recurring payments (for vendor subscriptions)
- Payment receipts
- Payment status tracking

## 5. Security Considerations

- Secure user authentication with JWT
- Payment data encryption
- HTTPS for all communications
- Input validation to prevent SQL injection
- CSRF protection
- Rate limiting to prevent abuse
- Regular security audits
- Data backup and recovery procedures

## 6. Scalability Considerations

- Microservices architecture for key components
- Database optimization for high traffic periods
- Caching strategy for frequently accessed data
- Load balancing for even distribution of traffic
- Horizontal scaling capabilities for peak event periods 