import { Application } from 'express'
import authMiddleware from '@/middlewares/auth'

import users from '@/routes/users'
import auth from '@/routes/auth'
import announcements from '@/routes/announcements'
import cities from '@/routes/cities'

export default function (app: Application) {
  // unauthorized routes:
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use('/api/cities', cities)
  // ----

  // authorized routes
  app.use(authMiddleware)

  app.use('/api/announcements', announcements)
  // ----
}
