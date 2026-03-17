const Medicine = require('../models/Medicine');

exports.getAllMedicines = async () => {
  return new Promise((resolve, reject) => {
    Medicine.findAll((err, medicines) => {
      if (err) return reject(err);
      resolve(medicines);
    });
  });
};

exports.getMedicineById = async (id) => {
  return new Promise((resolve, reject) => {
    Medicine.findById(id, (err, medicine) => {
      if (err) return reject(err);
      resolve(medicine);
    });
  });
};