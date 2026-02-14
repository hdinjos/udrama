import * as winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, errors, json, printf, colorize, splat } =
  winston.format;

const isProduction = process.env.NODE_ENV === 'production';

// Format untuk development (human readable)
const devFormat = printf((info) => {
  if (info.error) {
    return `${info.timestamp} [${info.context || 'App'}] ${info.level}: ${info.stack || info.message}, \n ${JSON.stringify(info.error, null, 0)}`;
  }
  return `${info.timestamp} [${info.context || 'App'}] ${info.level}: ${info.stack || info.message}`;
});

// Transport file rotation (best practice)
const fileTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: '%DATE%-application.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
});

// Transport error khusus
const errorTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: '%DATE%-error.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
});

export const winstonConfig = {
  level: isProduction ? 'info' : 'debug',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    splat(),
    isProduction ? json() : devFormat,
  ),
  defaultMeta: {
    service: 'nestjs-app',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    new winston.transports.Console({
      format: isProduction
        ? combine(timestamp(), json())
        : combine(colorize(), timestamp(), devFormat),
    }),
    fileTransport,
    errorTransport,
  ],
};
