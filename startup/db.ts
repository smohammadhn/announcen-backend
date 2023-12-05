import mongoose from 'mongoose'
import config from 'config'
import logger from './logging'

export default function () {
  mongoose.set('strictQuery', false)
  mongoose.set('returnOriginal', false)

  mongoose
    .connect(config.get('dbUri'))
    .then(() =>
      logger.info(`Success: connected to ${config.get('dbUri')} database`)
    )
}
