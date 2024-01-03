import express, { Response } from 'express'
import { errorMessage } from '../helpers/core'
import User, { UserDocument } from '../models/user'

const router = express.Router()

// register user
router.post('/', async ({ body }: { body: UserDocument }, res: Response) => {
  const { valid, message } = User.validateLogin(body)
  if (!valid) res.status(400).send(errorMessage(message))

  // make sure there is no user with the same email in the database
  const foundUser = await User.findOne({ email: body.email })
  if (foundUser) return res.status(400).send(errorMessage('User already registered.'))

  const incomingItem = User.createFromRequest(body)
  await incomingItem.save().then((result) => res.send(result))
})

// update user
// router.put('/update', auth, async (req: CustomRequest, res: Response) => {
//   const { valid, message } = User.validateLogin(req.body)
//   if (!valid) res.status(400).send(errorMessage(message))

//   await User.findByIdAndUpdate(req.userId, req.body).then((result) => {
//     if (!result) return res.status(404).send('User with the given id not found!')

//     res.send(result)
//   })
// })

export default router
