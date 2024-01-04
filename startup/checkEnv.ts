import logger from '@/startup/logging'

const requiredEnvVars = ['PORT', 'JWT_SECRET', 'DB_CONNECTION_STRING', 'NODE_ENV', 'WEBSITE_URL']

requiredEnvVars.forEach((envKey) => {
  if (!process.env[envKey]) {
    logger.error(`Missing ${envKey} environment variable. Have you forgotten to set your environment variables?`)
    process.exit(1)
  }
})
