const db = require('../database/connection.js');

class Reminder {
  // Get patients whose end_date is today
  static getTodaysReminders(callback) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    db.all(
      `SELECT name, phone, disease, end_date 
       FROM patients 
       WHERE end_date = ? 
       ORDER BY name`,
      [today],
      callback
    );
  }

  // Get patients whose end_date is tomorrow
  static getTomorrowsReminders(callback) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    db.all(
      `SELECT name, phone, disease, end_date 
       FROM patients 
       WHERE end_date = ? 
       ORDER BY name`,
      [tomorrowStr],
      callback
    );
  }

  // Get combined reminders for today + tomorrow
  static getReminders(callback) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const query = `
      SELECT name, phone, disease, end_date,
             CASE 
               WHEN end_date = ? THEN 'today'
               WHEN end_date = ? THEN 'tomorrow'
             END as reminder_type
      FROM patients 
      WHERE end_date IN (?, ?)
      ORDER BY end_date, name
    `;
    
    db.all(query, [today, tomorrowStr, today, tomorrowStr], (err, reminders) => {
      if (err) {
        callback(err, []);
        return;
      }
      callback(null, reminders);
    });
  }
}

module.exports = Reminder;

