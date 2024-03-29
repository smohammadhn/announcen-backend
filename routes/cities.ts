import express, { Response } from 'express'
import City from '@/models/city'

const router = express.Router()

router.get('/', async (_, res: Response) => {
  await City.find()
    .sort({ name: 1 })
    .then((result) => {
      res.send(result)
    })
})

export default router
