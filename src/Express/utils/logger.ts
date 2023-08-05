import winston from "winston";
const { combine, timestamp, json, colorize, align, printf } = winston.format;

const loggerConfig = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize({ all: true }),
    timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
    
});


export default loggerConfig