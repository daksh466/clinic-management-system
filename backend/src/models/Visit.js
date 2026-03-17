const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visit = sequelize.define('Visit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clinic_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'clinics', key: 'id' } },
  patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'patients', key: 'id' } },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'doctors', key: 'id' } },
  visit_date: { type: DataTypes.DATE, allowNull: false },
  notes: { type: DataTypes.STRING },
}, {
  tableName: 'visits',
  timestamps: true
});

module.exports = Visit;
