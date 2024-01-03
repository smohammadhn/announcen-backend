import express, { Response } from 'express'
import { errorMessage } from '../helpers/core'
import auth from '../middlewares/auth'
import User, { UserDocument } from '../models/user'

const router = express.Router()

// perform login
router.post('/', async ({ body }: { body: UserDocument }, res: Response) => {
  const { valid, message } = User.validateLogin(body)
  if (!valid) res.status(400).send(errorMessage(message))

  // make sure there IS a user with this email in the database
  const foundUser = await User.findOne({ email: body.email })
  if (!foundUser) return res.status(400).send(errorMessage('Invalid email or password'))

  // body and foundUser both guaranteed to have password
  const isPasswordValid = foundUser.checkPassword(body.password)
  if (!isPasswordValid) return res.status(400).send(errorMessage('Invalid email or password'))

  const token = foundUser.generateAuthToken()

  return res.status(200).send({
    access: token,
    user: foundUser,
  })
})

// verify token
router.post('/verify', auth, async (req: CustomRequest, res: Response) => {
  const foundUser = await User.findById(req.userId)
  if (!foundUser) return res.status(401).send(errorMessage('User does not exist.'))

  return res.status(200).send({
    message: 'Token is valid.',
    user: foundUser,
  })
})

export default router
