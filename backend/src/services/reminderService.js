const Reminder = require('../models/Reminder');

exports.getAllReminders = async () => {
  return new Promise((resolve, reject) => {
    Reminder.findAll((err, reminders) => {
      if (err) return reject(err);
      resolve(reminders);
    });
  });
};

exports.getReminderById = async (id) => {
  return new Promise((resolve, reject) => {
    Reminder.findById(id, (err, reminder) => {
      if (err) return reject(err);
      resolve(reminder);
    });
  });
};