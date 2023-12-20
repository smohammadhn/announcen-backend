import 'dotenv/config'
import express, { Application } from 'express'
import initDb from './startup/db'
import initRoutes from './startup/routes'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import logger from './startup/logging'
import cors from 'cors'

const port = process.env.PORT || 8000
const app: Application = express()

// Init express and use some built-in middlewares:
// STATIC: enable /public folder to be shown at domain:port/somethingInsideStaticFolder
// JSON: if the body of the incoming request contains a JSON object, it populates req.body
// URLENCODED: parses incoming requests with urlencoded payloads and is based on body-parser (eg. requests using html forms)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie Parser: able to access req.cookies['cookie-name']
app.use(cookieParser())

// MORGAN: logging api requests
app.use(morgan('tiny'))

// check for required environment variables before starting the server
const requiredEnvVars = ['PORT', 'JWT_SECRET', 'DB_CONNECTION_STRING']
requiredEnvVars.forEach((envKey) => {
  if (!process.env[envKey]) {
    logger.error(`${envKey} environment variable not found, Have you forgotten to set your environment variables?`)
    process.exit(1)
  }
})

// cors
app.use(
  cors({
    origin: process.env.WEBSITE_URL!,
    allowedHeaders: ['content-type', 'auth-token', '*'],
    methods: ['GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH'],
    credentials: true,
  })
)

// startup files imports
initDb()
initRoutes(app)

app.listen(port, () => logger.info(`Listening on port ${port} ...`))
