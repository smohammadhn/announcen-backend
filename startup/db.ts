import mongoose from 'mongoose'
import logger from './logging'

export default async function () {
  mongoose.set('strictQuery', false)
  mongoose.set('returnOriginal', false)

  return mongoose
    .connect(process.env.DB_CONNECTION_STRING!)
    .then(() => logger.info(`Success: connected to database`))
    .catch((err) => logger.error(`Error: database connection error`))
}
