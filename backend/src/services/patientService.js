exports.getPatientById = async (id) => {
  return new Promise((resolve, reject) => {
    Patient.findById(id, (err, patient) => {
      if (err) return reject(err);
      resolve(patient);
    });
  });
};
const Patient = require('../models/Patient');

exports.getAllPatients = async () => {
  return Patient.findAll();
};