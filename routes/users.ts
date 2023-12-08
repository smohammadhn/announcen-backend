import express, { Request, Response } from 'express'
import User, { validateUser, UserDocument } from '../models/user'
import { errorMessage } from '../helpers/core'
import _ from 'lodash'
import bcrypt from 'bcrypt'

const router = express.Router()

// register user
router.post('/', async ({ body }: { body: UserDocument }, res: Response) => {
  if (!validateUser(body, res)) return

  // make sure there is no user with the same email in the database
  const foundUser = await User.findOne({ email: body.email })
  if (foundUser)
    return res.status(400).send(errorMessage('User already registered.'))

  const incomingItem = new User(_.pick(body, ['email', 'password']))

  if (incomingItem.password)
    incomingItem.password = await bcrypt.hash(incomingItem.password, 10)

  await incomingItem
    .save()
    .then((result) => res.send(_.omit(result.toObject(), ['password'])))
})

export = router
