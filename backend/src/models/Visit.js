const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visit = sequelize.define('Visit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'patients', key: 'id' } },
  diagnosis: { type: DataTypes.STRING },
  medicines: { type: DataTypes.STRING },
  notes: { type: DataTypes.STRING },
  visit_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'visits',
  timestamps: false
});

module.exports = Visit;
