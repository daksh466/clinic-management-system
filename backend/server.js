const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic request logging (lightweight alternative to morgan)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection - For deployment (Render/Railway), mount volume for ./clinic.db persistence
// Local: auto-creates clinic.db
const db = require('./database/connection.js');

app.locals.db = db; // Make db available to routes

// Ensure sqlite has foreign key enforcement enabled
if (db && typeof db.run === 'function') {
  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA journal_mode = WAL');
}

// Routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/reminders', require('./routes/reminders'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', db: 'connected', timestamp: new Date().toISOString() });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ayurvedic Clinic Management API v2 - Medicine & Reminders Added',
    endpoints: {
      patients: '/api/patients (GET all, POST, GET/:id, PUT/:id, DELETE/:id)',
      medicines: '/api/medicines (GET all w/low_stock, POST, GET/:id, PUT/:id, DELETE/:id), /api/medicines/low-stock',
      reminders: '/api/reminders (GET today+tomorrow patients)'
    },
    health: '/health'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled route error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Patients API: http://localhost:${PORT}/api/patients`);
});

// Graceful shutdown
function shutdown(reason) {
  console.log('Shutting down server:', reason);
  server.close(() => {
    if (db && typeof db.close === 'function') {
      db.close(() => {
        console.log('Database connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});

