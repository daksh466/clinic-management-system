const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clinic_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'clinics', key: 'id' } },
  name: { type: DataTypes.STRING, allowNull: false },
  specialization: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
}, {
  tableName: 'doctors',
  timestamps: true
});

module.exports = Doctor;
