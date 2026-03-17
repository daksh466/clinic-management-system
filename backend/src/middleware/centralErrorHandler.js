module.exports = (err, req, res, next) => {
  const logger = require('./logger');
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user || null
  });
  res.status(500).json({ error: 'Internal Server Error' });
};
