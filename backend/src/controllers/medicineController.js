const medicineService = require('../services/medicineService');

exports.getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await medicineService.getAllMedicines();
    res.json(medicines);
  } catch (err) {
    next(err);
  }
};

exports.getMedicineById = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid medicine id' });
  }
  try {
    const medicine = await medicineService.getMedicineById(id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json({ medicine });
  } catch (err) {
    next(err);
  }
};