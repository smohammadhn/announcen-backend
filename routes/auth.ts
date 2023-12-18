import express, { CookieOptions, Response } from 'express'
import User, { validateLogin, UserDocument } from '../models/user'
import { errorMessage } from '../helpers/core'
import _ from 'lodash'
import bcrypt from 'bcrypt'
import auth from '../middlewares/auth'

const router = express.Router()

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 3600000,
}

// perform login
router.post('/', async ({ body }: { body: UserDocument }, res: Response) => {
  if (!validateLogin(body, res)) return

  // make sure there is a user with this email in the database
  const foundUser = await User.findOne({ email: body.email })
  if (!foundUser)
    return res.status(400).send(errorMessage('Invalid email or password'))

  if (body.password && foundUser.password) {
    const validPassword = await bcrypt.compare(
      body.password,
      foundUser.password
    )

    if (!validPassword)
      return res.status(400).send(errorMessage('Invalid email or password'))
  } else {
    return res.status(400).send(errorMessage('Invalid email or password'))
  }

  // generate auth token
  const token = foundUser.generateAuthToken()

  return res.status(200).send({
    access: token,
    user: foundUser,
  })
})

// verify token
router.post('/verify', auth, async (req: CustomRequest, res: Response) => {
  console.log('verify called')

  const foundUser = await User.findById(req.userId)
  if (!foundUser)
    return res.status(401).send(errorMessage('User does not exist.'))

  return res.status(200).send({
    message: 'Token is valid.',
    user: foundUser,
  })
})

export = router
