const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  billplzBillId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  billplzUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  billplzResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('billplzResponse');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('billplzResponse', JSON.stringify(value));
    }
  }
}, {
  timestamps: true
});

module.exports = Payment; 