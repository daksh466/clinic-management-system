const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// GET /api/reminders - Get treatment reminders for today & tomorrow
router.get('/', (req, res) => {
  Reminder.getReminders((err, reminders) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Group by type
    const todayReminders = reminders.filter(r => r.reminder_type === 'today');
    const tomorrowReminders = reminders.filter(r => r.reminder_type === 'tomorrow');
    
    res.json({ 
      reminders,
      summary: {
        today: todayReminders.length,
        tomorrow: tomorrowReminders.length,
        total: reminders.length
      }
    });
  });
});

module.exports = router;

