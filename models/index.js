const sequelize = require('../config/db');
const User = require('./User');
const Booking = require('./Booking');
const Lot = require('./Lot');
const Event = require('./Event');
const Slot = require('./Slot');
const Payment = require('./Payment');

// Define relationships
User.hasMany(Booking);
Booking.belongsTo(User);

// Legacy relationship
Lot.hasOne(Booking);
Booking.belongsTo(Lot);

// New relationships
Event.hasMany(Slot);
Slot.belongsTo(Event);

Slot.hasOne(Booking);
Booking.belongsTo(Slot);

Booking.hasOne(Payment);
Payment.belongsTo(Booking);

User.hasMany(Payment);
Payment.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Booking,
  Lot,
  Event,
  Slot,
  Payment
}; 