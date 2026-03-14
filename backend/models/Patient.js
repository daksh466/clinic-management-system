const db = require('../database/connection.js');

class Patient {
  static findAll(callback) {
    db.all('SELECT * FROM patients ORDER BY created_at DESC', [], callback);
  }

  static findById(id, callback) {
    db.get('SELECT * FROM patients WHERE id = ?', [id], callback);
  }

  static create(patientData, callback) {
    const {
      name, age, phone, disease, medicines, parhej, course_duration_days, start_date, precautions
    } = patientData;

    // Calculate end_date only when start_date and duration are valid
    let end_date = null;
    if (start_date && !Number.isNaN(Number(course_duration_days))) {
      const start = new Date(start_date);
      if (!Number.isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(end.getDate() + parseInt(course_duration_days, 10));
        end_date = end.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
    }

    db.run(
      `INSERT INTO patients (name, age, phone, disease, medicines, parhej, course_duration_days, start_date, end_date, precautions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, age, phone, disease, medicines, parhej, course_duration_days, start_date, end_date, precautions],
      function(err) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id: this.lastID });
        }
      }
    );
  }

  static update(id, patientData, callback) {
    const {
      name, age, phone, disease, medicines, parhej, course_duration_days, start_date, precautions
    } = patientData;
    
    // Recalculate end_date if start_date and course_duration_days are valid
    let end_date = null;
    if (start_date && !Number.isNaN(Number(course_duration_days))) {
      const start = new Date(start_date);
      if (!Number.isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(end.getDate() + parseInt(course_duration_days, 10));
        end_date = end.toISOString().split('T')[0];
      }
    }

    const query = end_date 
      ? `UPDATE patients SET name = ?, age = ?, phone = ?, disease = ?, medicines = ?, parhej = ?, precautions = ?,
         course_duration_days = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      : `UPDATE patients SET name = ?, age = ?, phone = ?, disease = ?, medicines = ?, parhej = ?, precautions = ?,
         course_duration_days = ?, start_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    const params = end_date 
      ? [name, age, phone, disease, medicines, parhej, precautions, course_duration_days, start_date, end_date, id]
      : [name, age, phone, disease, medicines, parhej, precautions, course_duration_days, start_date, id];

    db.run(query, params, function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  static delete(id, callback) {
    db.run('DELETE FROM patients WHERE id = ?', [id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }
}

module.exports = Patient;

