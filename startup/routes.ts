import { Application } from 'express'
import errorMiddleware from '../middlewares/error'
import authMiddleware from '../middlewares/auth'

import users from '../routes/users'
import auth from '../routes/auth'
import announcements from '../routes/announcements'

export default function (app: Application) {
  // unauthorized routes
  app.use('/api/users', users)
  app.use('/api/auth', auth)

  // all routes are protected (except register/login)
  app.use(authMiddleware)

  // authorized routes
  app.use('/api/announcements', announcements)

  // global error handler (works in combination with express-async-errors)
  app.use(errorMiddleware)
}
