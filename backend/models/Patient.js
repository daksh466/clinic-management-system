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

  // NEW: Search patients by name, phone, or disease (case-insensitive)
  static search(type, query, callback) {
    if (!['name', 'phone', 'disease'].includes(type)) {
      return callback(new Error('Invalid search type'), []);
    }
    const sql = `SELECT * FROM patients WHERE LOWER(${type}) LIKE LOWER(?) ORDER BY created_at DESC`;
    db.all(sql, [`%${query}%`], callback);
  }

  // NEW: Get patients for specific month/year
  static monthly(year, month, callback) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const nextMonth = new Date(year, month, 0);
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${nextMonth.getDate()}`;
    const sql = `SELECT * FROM patients WHERE created_at >= ? AND created_at < ? ORDER BY created_at DESC`;
    db.all(sql, [startDate, `${endDate} 23:59:59`], callback);
  }

  // NEW: Get insights - common diseases and medicines
  static getInsights(callback) {
    // Common diseases
    const diseaseSql = `
      SELECT disease, COUNT(*) as count 
      FROM patients 
      WHERE disease IS NOT NULL AND TRIM(disease) != '' 
      GROUP BY LOWER(TRIM(disease)) 
      ORDER BY count DESC 
      LIMIT 10
    `;
    
    // Common medicines (parse comma-separated text field)
    const medicineSql = `
      SELECT TRIM(m.value) as medicine, COUNT(*) as count
      FROM patients, json_each('["' || replace(medicines, ',', '","') || '"]') as m
      WHERE medicines IS NOT NULL AND TRIM(medicines) != '' AND TRIM(m.value) != ''
      GROUP BY LOWER(TRIM(m.value))
      ORDER BY count DESC
      LIMIT 10
    `;

    db.all(diseaseSql, [], (err, diseases) => {
      if (err) return callback(err, null);
      
      db.all(medicineSql, [], (err2, medicines) => {
        if (err2) return callback(err2, null);
        callback(null, {
          commonDiseases: diseases,
          commonMedicines: medicines,
          totalPatients: diseases.reduce((sum, d) => sum + d.count, 0) // approx
        });
      });
    });
  }
}

module.exports = Patient;

