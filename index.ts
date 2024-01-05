import 'dotenv/config'

import express, { Application } from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import '@/startup/checkEnv'
import initDb from '@/startup/db'
import initRoutes from '@/startup/routes'
import logger from '@/startup/logging'
import errorMiddleware from '@/middlewares/error'

const port = process.env.PORT || 8000
const app: Application = express()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(
  cors({
    origin: process.env.WEBSITE_URL!,
    allowedHeaders: ['content-type', 'authorization', '*'],
    methods: ['GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH'],
    credentials: true,
  })
)

await initDb()
initRoutes(app)

// global error handler (works in combination with express-async-errors)
// must be AFTER all routes
app.use(errorMiddleware)

app.listen(port, () => logger.info(`Listening on port ${port} ...`))
