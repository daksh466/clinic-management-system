const reminderService = require('../services/reminderService');

exports.getAllReminders = async (req, res, next) => {
  try {
    const reminders = await reminderService.getAllReminders();
    res.json(reminders);
  } catch (err) {
    next(err);
  }
};

exports.getReminderById = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid reminder id' });
  }
  try {
    const reminder = await reminderService.getReminderById(id);
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ reminder });
  } catch (err) {
    next(err);
  }
};