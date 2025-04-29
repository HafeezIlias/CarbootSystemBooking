const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Slot = sequelize.define('slot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  slotNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locationDescription: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('available', 'reserved', 'booked', 'canceled'),
    defaultValue: 'available'
  },
  reservedUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Slot; 