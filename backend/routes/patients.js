const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// GET /patients - List all patients
router.get('/', patientController.getAllPatients);

// GET /patients/:id - Get single patient
router.get('/:id', patientController.getPatientById);

// Basic request validation helpers
function validatePatientPayload(payload) {
  const errors = [];
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    errors.push('name is required');
  }
  if (!payload.start_date || isNaN(new Date(payload.start_date).getTime())) {
    errors.push('start_date is required and must be a valid date');
  }
  if (payload.course_duration_days == null || Number.isNaN(Number(payload.course_duration_days)) || Number(payload.course_duration_days) < 0) {
    errors.push('course_duration_days is required and must be a non-negative number');
  }
  return errors;
}

// POST /patients - Create new patient
router.post('/', (req, res) => {
  const patientData = req.body;
  const validationErrors = validatePatientPayload(patientData);
  if (validationErrors.length) {
    return res.status(400).json({ errors: validationErrors });
  }

  Patient.create(patientData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const endDate = new Date(new Date(patientData.start_date).getTime() + parseInt(patientData.course_duration_days) * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    res.status(201).json({ message: 'Patient created successfully', patient: { ...patientData, id: result.id, end_date: endDate } });
  });
});

// PUT /patients/:id - Update patient
router.put('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid patient id' });

  const patientData = req.body;
  const validationErrors = validatePatientPayload(patientData);
  if (validationErrors.length) {
    return res.status(400).json({ errors: validationErrors });
  }

  Patient.update(id, patientData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient updated successfully' });
  });
});

// NEW: Search patients
router.get('/search', (req, res) => {
  const { type, q: query } = req.query;
  if (!type || !query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'type (name|phone|disease) and q (query) required' });
  }

  Patient.search(type.trim(), query.trim(), (err, patients) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ patients, query: { type, q: query } });
  });
});

// NEW: Monthly patients report
router.get('/reports/monthly', (req, res) => {
  const { year, month } = req.query;
  const y = parseInt(year);
  const m = parseInt(month);
  if (isNaN(y) || isNaN(m) || y < 1900 || y > 2100 || m < 1 || m > 12) {
    return res.status(400).json({ error: 'Valid year (YYYY) and month (1-12) required' });
  }

  Patient.monthly(y, m, (err, patients) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ patients, period: `${year}-${month}` });
  });
});

// NEW: Insights report
router.get('/reports/insights', (req, res) => {
  Patient.getInsights((err, insights) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ insights });
  });
});

// DELETE /patients/:id - Delete patient
router.delete('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid patient id' });

  Patient.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  });
});

module.exports = router;
