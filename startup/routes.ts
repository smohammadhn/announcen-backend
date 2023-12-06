import { Application } from 'express'
import error from '../middlewares/error'

import users from '../routes/users'
import auth from '../routes/auth'

export default async function (app: Application) {
  app.use('/api/users', users)
  app.use('/api/auth', auth)

  // global error handler (works in combination with express-async-errors)
  app.use(error)
}
