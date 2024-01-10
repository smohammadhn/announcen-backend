import express, { Response } from 'express'
import { errorMessage } from '@/helpers/core'
import Organization, { OrganizationDocument } from '@/models/organization'
import auth from '@/middlewares/auth'

const router = express.Router()

// get the list of all organizations (auth protected)
router.get('/', auth, async (_, res: Response) => {
  await Organization.find().then((result) => {
    res.send(result)
  })
})

// register user
router.post('/', async ({ body }: { body: OrganizationDocument }, res: Response) => {
  const { valid, message } = Organization.validateOrganization(body)
  if (!valid) res.status(400).send(errorMessage(message))

  // make sure there is no Organization with the same email in the database
  const foundOrganization = await Organization.findOne({ email: body.email })
  if (foundOrganization) return res.status(400).send(errorMessage('Organization already registered.'))

  const incomingItem = Organization.createFromRequest(body)
  await incomingItem.save().then((result) => res.send(result))
})

export default router
