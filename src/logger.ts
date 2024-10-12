/* eslint-disable prettier/prettier */
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [new transports.Console(), new transports.File({ filename: 'error.log', level: 'error' })],
});
