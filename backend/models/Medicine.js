const db = require('../database/connection.js');

class Medicine {
  static findAll(callback) {
    const query = `
      SELECT *, 
      CASE WHEN quantity < 10 THEN 1 ELSE 0 END as low_stock 
      FROM medicines 
      ORDER BY created_at DESC
    `;
    db.all(query, [], (err, medicines) => {
      if (err) {
        callback(err, []);
        return;
      }
      // Add low_stock boolean
      const result = medicines.map(m => ({
        ...m,
        low_stock: m.low_stock === 1
      }));
      callback(null, result);
    });
  }

  static getLowStockMedicines(callback) {
    db.all(
      'SELECT *, CASE WHEN quantity < 10 THEN 1 ELSE 0 END as low_stock FROM medicines WHERE quantity < 10 ORDER BY quantity ASC',
      [],
      (err, medicines) => {
        if (err) {
          callback(err, []);
          return;
        }
        const result = medicines.map(m => ({
          ...m,
          low_stock: true
        }));
        callback(null, result);
      }
    );
  }

  static findById(id, callback) {
    db.get('SELECT *, CASE WHEN quantity < 10 THEN 1 ELSE 0 END as low_stock FROM medicines WHERE id = ?', [id], (err, medicine) => {
      if (err || !medicine) {
        callback(err, null);
        return;
      }
      callback(null, {
        ...medicine,
        low_stock: medicine.low_stock === 1
      });
    });
  }

  static create(medicineData, callback) {
    const { medicine_name, quantity, expiry_date } = medicineData;
    
    db.run(
      'INSERT INTO medicines (medicine_name, quantity, expiry_date) VALUES (?, ?, ?)',
      [medicine_name, quantity, expiry_date],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID });
        }
      }
    );
  }

  static update(id, medicineData, callback) {
    const { medicine_name, quantity, expiry_date } = medicineData;
    
    db.run(
      'UPDATE medicines SET medicine_name = ?, quantity = ?, expiry_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [medicine_name, quantity, expiry_date, id],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { changes: this.changes });
        }
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM medicines WHERE id = ?', [id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }
}

module.exports = Medicine;

