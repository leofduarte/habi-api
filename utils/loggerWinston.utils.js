const { createLogger, format, transports } = require('winston');
const DatadogWinston = require('datadog-winston');

const datadogApiKey = process.env.DATADOG_API_KEY;
const datadogService = process.env.DATADOG_SERVICE_NAME || 'habi-api';

const loggerTransports = [
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ timestamp, level, message, ...meta }) => {
        return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
      })
    )
  }),
  new transports.File({ filename: 'logs/error.log', level: 'error' }),
  new transports.File({ filename: 'logs/combined.log' }),
];

if (datadogApiKey) {
  loggerTransports.push(
    new DatadogWinston({
      apiKey: datadogApiKey,
      service: datadogService,
      ddsource: 'nodejs',
      ddtags: `env:${process.env.NODE_ENV || 'development'}`,
      hostname: process.env.DATADOG_HOSTNAME || undefined,
      handleExceptions: true,
      handleRejections: true,
      silent: false,
      level: 'info',
    })
  );
}

const loggerWinston = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: loggerTransports,
});

module.exports = loggerWinston;