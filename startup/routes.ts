import { Application } from 'express'
import authMiddleware from '@/middlewares/auth'

import users from '@/routes/users'
import auth from '@/routes/auth'
import announcements from '@/routes/announcements'

export default function (app: Application) {
  // unauthorized routes:
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  // ----

  // authorized routes
  app.use(authMiddleware)

  app.use('/api/announcements', announcements)
  // ----
}
