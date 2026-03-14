const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

function parseId(param) {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateMedicinePayload(payload) {
  const errors = [];
  if (!payload.medicine_name || typeof payload.medicine_name !== 'string' || payload.medicine_name.trim().length === 0) {
    errors.push('medicine_name is required');
  }
  if (payload.quantity == null || Number.isNaN(Number(payload.quantity)) || Number(payload.quantity) < 0) {
    errors.push('quantity is required and must be a non-negative number');
  }
  return errors;
}

// GET /api/medicines - List all medicines with low_stock flag
router.get('/', (req, res) => {
  Medicine.findAll((err, medicines) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ medicines });
  });
});

// GET /api/medicines/low-stock - Low stock medicines
router.get('/low-stock', (req, res) => {
  Medicine.getLowStockMedicines((err, medicines) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ low_stock_medicines: medicines });
  });
});

// GET /api/medicines/:id - Get single medicine
router.get('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid medicine id' });

  Medicine.findById(id, (err, medicine) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json({ medicine });
  });
});

// POST /api/medicines - Create new medicine
router.post('/', (req, res) => {
  const medicineData = req.body;
  const validationErrors = validateMedicinePayload(medicineData);
  if (validationErrors.length) {
    return res.status(400).json({ errors: validationErrors });
  }

  Medicine.create(medicineData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: 'Medicine created successfully', 
      medicine: { ...medicineData, id: result.id }
    });
  });
});

// PUT /api/medicines/:id - Update medicine
router.put('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid medicine id' });

  const medicineData = req.body;
  const validationErrors = validateMedicinePayload(medicineData);
  if (validationErrors.length) {
    return res.status(400).json({ errors: validationErrors });
  }

  Medicine.update(id, medicineData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json({ message: 'Medicine updated successfully' });
  });
});

// DELETE /api/medicines/:id - Delete medicine
router.delete('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid medicine id' });

  Medicine.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted successfully' });
  });
});

module.exports = router;

