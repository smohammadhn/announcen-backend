// This middleware is registered after all of other route middlewares so
// it will automatically trigger if any kind of error happens inside route handlers
// (as a result of 'express-async-errors' package)

import { Request, Response, NextFunction } from 'express'
import logger from '../startup/logging'

export default function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.message)
  res.status(400).send('Bad request:>> ' + err)

  // This mutherfucker took 2 hours of my life, do not delete it
  next()
}
