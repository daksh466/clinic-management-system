exports.getPatientById = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid patient id' });
  }
  try {
    const patient = await patientService.getPatientById(id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ patient });
  } catch (err) {
    next(err);
  }
};
const patientService = require('../services/patientService');

exports.getAllPatients = async (req, res, next) => {
  try {
    console.log("Patients API called");
    const patients = await patientService.getAllPatients();
    res.json(patients);
  } catch (err) {
    next(err);
  }
};