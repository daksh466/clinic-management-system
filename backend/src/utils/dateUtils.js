exports.formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

exports.addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
