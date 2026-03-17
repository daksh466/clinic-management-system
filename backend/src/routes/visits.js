const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');

// Create a new visit
router.post('/', async (req, res) => {
  try {
    const { patient_id, diagnosis, medicines, notes } = req.body;
    const visit = await Visit.create({ patient_id, diagnosis, medicines, notes });
    res.status(201).json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get visit history for a patient
router.get('/patients/:id/visits', async (req, res) => {
  try {
    const patientId = req.params.id;
    const visits = await Visit.findAll({
      where: { patient_id: patientId },
      order: [['visit_date', 'DESC']]
    });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
