import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format for console logging
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // Default to info level
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Print stack trace for errors
        process.env.NODE_ENV === 'production' ? winston.format.json() : winston.format.simple()
    ),
    transports: [
        // Always log to console
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            )
        }),
        // Optional: Log to file in production (if needed, but usually stdout is enough for containers)
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Create a stream for other middlewares (like morgan if we used it)
export const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};
