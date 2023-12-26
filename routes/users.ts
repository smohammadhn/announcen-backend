import bcrypt from 'bcrypt'
import express, { Response } from 'express'
import _ from 'lodash'
import { errorMessage } from '../helpers/core'
import auth from '../middlewares/auth'
import User, { UserDocument, validateLogin, validateUser } from '../models/user'

const router = express.Router()

// register user
router.post('/', async ({ body }: { body: UserDocument }, res: Response) => {
  if (!validateLogin(body, res)) return

  // make sure there is no user with the same email in the database
  const foundUser = await User.findOne({ email: body.email })
  if (foundUser) return res.status(400).send(errorMessage('User already registered.'))

  const incomingItem = new User(_.pick(body, ['email', 'password']))

  if (incomingItem.password) incomingItem.password = await bcrypt.hash(incomingItem.password, 10)

  await incomingItem.save().then((result) => res.send(_.omit(result.toObject(), ['password'])))
})

// update user
router.put('/update', auth, async (req: CustomRequest, res: Response) => {
  if (!validateUser(req.body, res)) return

  await User.findByIdAndUpdate(req.userId, req.body).then((result) => {
    if (!result) return res.status(404).send('User with the given id not found!')

    res.send(_.omit(result.toObject(), ['password']))
  })
})

export = router
