const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

function parseId(param) {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /patients - List all patients
router.get('/', (req, res) => {
  Patient.findAll((err, patients) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ patients });
  });
});

// GET /patients/:id - Get single patient
router.get('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid patient id' });

  Patient.findById(id, (err, patient) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ patient });
  });
});

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
