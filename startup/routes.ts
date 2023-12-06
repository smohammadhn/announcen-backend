import { Application } from 'express'
import errorMiddleware from '../middlewares/error'
import authMiddleware from '../middlewares/auth'

import users from '../routes/users'
import auth from '../routes/auth'

export default async function (app: Application) {
  // unauthorized routes
  app.use('/api/users', users)
  app.use('/api/auth', auth)

  // all routes are protected (except register/login)
  app.use(authMiddleware)

  // authorized routes

  // global error handler (works in combination with express-async-errors)
  app.use(errorMiddleware)
}
