import { createLogger, format, transports } from 'winston'
import 'express-async-errors'

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.align(),
    format.json()
  ),

  transports: [
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console(
      new transports.File({
        handleExceptions: true,
        handleRejections: true,
        filename: 'logfile.log',
      })
    )
  )
}

export = logger
