import { Application } from 'express'
import error from '../middlewares/error'

import user from '../routes/user'

export default async function (app: Application) {
  app.use('/api/user', user)

  // global error handler (works in combination with express-async-errors)
  app.use(error)
}
