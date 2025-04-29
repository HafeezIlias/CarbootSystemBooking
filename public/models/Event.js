const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  termsConditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'active', 'completed', 'canceled'),
    defaultValue: 'upcoming'
  },
  amenities: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('amenities');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('amenities', JSON.stringify(value));
    }
  },
  weatherContingency: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Event; 