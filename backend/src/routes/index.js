const express = require('express');
const router = express.Router();

router.use('/patients', require('./patients'));
router.use('/medicines', require('./medicines'));
router.use('/reminders', require('./reminders'));

module.exports = router;
