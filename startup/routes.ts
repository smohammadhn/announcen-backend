import { Application } from 'express'
import error from '../middlewares/error'

import users from '../routes/users'

export default async function (app: Application) {
  app.use('/api/users', users)

  // global error handler (works in combination with express-async-errors)
  app.use(error)
}
