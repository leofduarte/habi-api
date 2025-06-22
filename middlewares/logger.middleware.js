const loggerWinston = require('../utils/loggerWinston.utils');

const LoggerMiddleware = (req, res, next) => {
  loggerWinston.info('Request', { method: req.method, url: req.url });
  next();
}

module.exports = LoggerMiddleware;