const loggerWinston = require('../utils/loggerWinston.utils');

module.exports = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6; // Convert nanoseconds to ms
    loggerWinston.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: durationMs.toFixed(2),
      userId: req.user?.userId || req.user?.id || undefined,
    });
  });
  next();
}; 