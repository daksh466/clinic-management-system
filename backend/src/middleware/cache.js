const cache = {};

module.exports = (duration = 60) => (req, res, next) => {
  const key = req.originalUrl;
  if (cache[key] && (Date.now() - cache[key].timestamp < duration * 1000)) {
    return res.json(cache[key].data);
  }
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache[key] = { data, timestamp: Date.now() };
    originalJson(data);
  };
  next();
};
