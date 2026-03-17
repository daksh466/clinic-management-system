const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const centralErrorHandler = require('./src/middleware/centralErrorHandler');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const apicache = require('apicache');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
// Gzip compression
app.use(compression());

// API caching
const cache = apicache.middleware;
app.use(cache('5 minutes'));

// Request rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
const PORT = process.env.PORT || 5000;

// Request logging (production-grade)
app.use(morgan('combined'));

// Middleware
app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'https://thriving-hamster-0f2940.netlify.app',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://localhost:8080',
      /^https:\/\/.*\.netlify\.app$/
    ].concat(
      (process.env.FRONTEND_URLS || '').split(',').map(url => url.trim()).filter(Boolean)
    );
    if (allowedOrigins.some(originPattern => {
      if (originPattern instanceof RegExp) {
        return originPattern.test(origin);
      }
      return originPattern === origin;
    })) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection using Sequelize
const sequelize = require('./src/config/database');
const Clinic = require('./src/models/Clinic');
const Doctor = require('./src/models/Doctor');
const Patient = require('./src/models/Patient');
const Medicine = require('./src/models/Medicine');
const Reminder = require('./src/models/Reminder');
const Visit = require('./src/models/Visit');

// Sync models
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });

// Routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/visits', require('./src/routes/visits'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    version: process.version
  });
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
app.use(centralErrorHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
console.log(`Patients API: /api/patients`);
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

