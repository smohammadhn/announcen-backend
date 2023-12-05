// Get project absolute Path
import { resolve } from 'path'

// DOTENV: enable usage of .env file for environment variables
import dotenv from 'dotenv'
dotenv.config({ path: resolve() + '/.env' })

// CONFIG: getting and setting global configuration for the project
import config from 'config'
;(config as any).path = resolve()

// Init express and use some built-in middlewares:
// STATIC: enable /public folder to be shown at domain:port/somethingInsideStaticFolder
// JSON: if the body of the incoming request contains a JSON object, it populates req.body
// URLENCODED: parses incoming requests with urlencoded payloads and is based on body-parser (eg. requests using html forms)
import express, { Application } from 'express'
const app: Application = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MORGAN: logging api requests
import morgan from 'morgan'
app.use(morgan('tiny'))

// startup files imports
import logger from './startup/logging'
import initDb from './startup/db'
import initRoutes from './startup/routes'
initDb()
initRoutes(app)

// check for required environment variables before starting the server
let isEnvVarsSet = true
const requiredEnvVars = ['PORT', 'JWT_SECRET']
requiredEnvVars.forEach((envKey) => {
  if (!process.env[envKey]) {
    logger.error(
      `${envKey} environment variable not found, Have you forgotten to set your environment variables?`
    )
    return (isEnvVarsSet = false)
  }
})

if (isEnvVarsSet) {
  const port = config.get('port')
  app.listen(port, () => logger.info(`Listening on port ${port} ...`))
}
