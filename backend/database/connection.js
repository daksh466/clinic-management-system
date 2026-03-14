const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Create database connection
const dbFile = path.join(__dirname, 'clinic.db');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database:', dbFile);
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create patients table
    db.run(`CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER,
      phone TEXT,
      disease TEXT,
      medicines TEXT,
      parhej TEXT,
      course_duration_days INTEGER,
      start_date DATE,
      end_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating patients table:', err.message);
      } else {
        console.log('Patients table created or already exists.');
      }
    });

    // Create medicines table
    db.run(`CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      expiry_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating medicines table:', err.message);
      } else {
        console.log('Medicines table created or already exists.');
      }
    });

    // Ensure precautions column exists without causing warnings
    db.all(`PRAGMA table_info(patients)`, (err, columns) => {
      if (err) {
        console.error('Error inspecting patients table schema:', err.message);
        return;
      }

      const hasPrecautions = columns.some(c => c.name === 'precautions');
      if (!hasPrecautions) {
        db.run(`ALTER TABLE patients ADD COLUMN precautions TEXT`, (alterErr) => {
          if (alterErr) {
            console.error('Warning adding precautions column:', alterErr.message);
          } else {
            console.log('Precautions column added.');
          }
        });
      } else {
        console.log('Precautions column already exists.');
      }
    });

    // Create indexes (after tables are ensured to exist)
    db.run(`CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name)`, (err) => {
      if (err) console.error('Index patients_name error:', err.message);
      else console.log('Index on patients.name created');
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_patients_start_date ON patients(start_date)`, (err) => {
      if (err) console.error('Index patients_start_date error:', err.message);
      else console.log('Index on patients.start_date created');
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_medicines_expiry ON medicines(expiry_date)`, (err) => {
      if (err) console.error('Index medicines_expiry error:', err.message);
      else console.log('Index on medicines.expiry_date created');
    });

    // Create treatments table
    db.run(`CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      medicine TEXT,
      notes TEXT,
      start_date DATE,
      end_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id)
    )`, (err) => {
      if (err) {
        console.error('Error creating treatments table:', err.message);
      } else {
        console.log('Treatments table created or already exists.');
      }
    });

    // Create appointments table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      appointment_date DATETIME NOT NULL,
      appointment_time TIME,
      purpose TEXT,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id)
    )`, (err) => {
      if (err) {
        console.error('Error creating appointments table:', err.message);
      } else {
        console.log('Appointments table created or already exists.');
      }
    });

    // Create treatment_prescriptions table
    db.run(`CREATE TABLE IF NOT EXISTS treatment_prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      medicine_id INTEGER,
      dosage TEXT,
      frequency TEXT,
      duration_days INTEGER,
      instructions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (medicine_id) REFERENCES medicines (id)
    )`, (err) => {
      if (err) {
        console.error('Error creating treatment_prescriptions table:', err.message);
      } else {
        console.log('Treatment prescriptions table created or already exists.');
      }
    });
  });
}

module.exports = db;