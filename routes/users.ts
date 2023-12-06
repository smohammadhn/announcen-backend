import express, { Request, Response } from 'express'
import oid from '../middlewares/oid'
import User, { validateUser, UserDocument } from '../models/user'
import { errorMessage } from '../helpers/core'
import _ from 'lodash'
import bcrypt from 'bcrypt'

const router = express.Router()

router.get('/:id', oid, async (req: Request, res: Response) => {
  await User.findById(req.params.id).then((result) => {
    if (!result)
      return res.status(404).send('User item with the given id not found!')

    res.send(result)
  })
})

// post methods
router.post('/', async ({ body }: { body: UserDocument }, res: Response) => {
  if (!validateUser(body, res)) return

  // make sure there is no user with the same email in the database
  const foundUser = await User.findOne({ email: body.email })
  if (foundUser)
    return res.status(400).send(errorMessage('User already registered.'))

  const incomingItem = new User(_.pick(body, ['email', 'name', 'password']))

  incomingItem.password = await bcrypt.hash(incomingItem.password, 10)

  await incomingItem
    .save()
    .then((result) => res.send(_.pick(result, ['name', 'email', '_id'])))
})

export = router
