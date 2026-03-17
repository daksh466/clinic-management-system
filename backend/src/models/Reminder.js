const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reminder = sequelize.define('Reminder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clinic_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'clinics', key: 'id' } },
  patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'patients', key: 'id' } },
  medicine_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'medicines', key: 'id' } },
  reminder_date: { type: DataTypes.DATE, allowNull: false },
  notes: { type: DataTypes.STRING },
}, {
  tableName: 'reminders',
  timestamps: true
});

module.exports = Reminder;
