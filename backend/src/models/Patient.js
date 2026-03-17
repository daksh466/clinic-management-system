const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clinic_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'clinics', key: 'id' } },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
}, {
  tableName: 'patients',
  timestamps: true
});

module.exports = Patient;
