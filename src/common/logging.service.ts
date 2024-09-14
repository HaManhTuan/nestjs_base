// src/common/logging.service.ts
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Define the custom format for the logs
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'application-%DATE%.log',
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // Keep logs for 14 days
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'application-error.log',
      level: 'error',
      dirname: 'logs',
    }),
  ],
});

@Injectable()
export class LoggingService {
  error(message: string, meta?: any) {
    logger.error(message, meta);
  }

  warn(message: string, meta?: any) {
    logger.warn(message, meta);
  }

  info(message: string, meta?: any) {
    logger.info(message, meta);
  }

  debug(message: string, meta?: any) {
    logger.debug(message, meta);
  }
}
