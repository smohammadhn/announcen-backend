import express, { Request, Response } from 'express'
import oid from '../middlewares/oid'
import Contact, { validateContact, ContactDocument } from '../models/users'

const router = express.Router()

// get methods
router.get('/', async (req: Request, res: Response) => {
  await Contact.find()
    .sort('_id')
    .then((result) => {
      res.send(result)
    })
})

router.get('/:id', oid, async (req: Request, res: Response) => {
  await Contact.findById(req.params.id).then((result) => {
    if (!result)
      return res.status(404).send('Contact item with the given id not found!')

    res.send(result)
  })
})

// post methods
router.post('/', async ({ body }: { body: ContactDocument }, res: Response) => {
  if (!validateContact(body, res)) return

  const incomingItem = new Contact({
    slug: body.slug,
    value: body.value,
  })

  await incomingItem.save().then((result) => res.send(result))
})

// put method
router.put('/:id', oid, async (req: Request, res: Response) => {
  if (!validateContact(req.body, res)) return

  await Contact.findByIdAndUpdate(req.params.id, req.body).then((result) => {
    if (!result)
      return res.status(404).send('Contact item with the given id not found!')

    res.send(result)
  })
})

// delete method
router.delete('/:id', oid, async (req: Request, res: Response) => {
  await Contact.findByIdAndRemove(req.params.id).then((result) => {
    if (!result)
      return res.status(404).send('Contact item with the given id not found!')

    res.send(result)
  })
})

export = router
