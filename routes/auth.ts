import express, { Response } from 'express'
import User, { validateLogin, UserDocument } from '../models/user'
import { errorMessage } from '../helpers/core'
import _ from 'lodash'
import bcrypt from 'bcrypt'

const router = express.Router()

// post methods
router.post('/', async ({ body }: { body: UserDocument }, res: Response) => {
  if (!validateLogin(body, res)) return

  // make sure there is a user with this email in the database
  const foundUser = await User.findOne({ email: body.email })
  if (!foundUser)
    return res.status(400).send(errorMessage('Invalid email or password'))

  const validPassword = await bcrypt.compare(body.password, foundUser.password)
  if (!validPassword)
    return res.status(400).send(errorMessage('Invalid email or password'))

  // generate auth token
  const token = foundUser.generateAuthToken()

  return res.status(200).send({
    access: token,
  })
})

export = router
