import express, { Response } from 'express'
import { errorMessage } from '@/helpers/core'
import oid from '@/middlewares/oid'
import Announcement, { AnnouncementDocument } from '@/models/announcement'

interface IGetAnnouncementQuery {
  type?: string
  sorting?: string
}

const router = express.Router()

// get methods
router.get('/', async (req: CustomRequest<{}, {}, IGetAnnouncementQuery>, res: Response) => {
  const filters: {
    userId: string
    type?: string
  } = { userId: req.userId! }

  // acts as a mapper: receives sort slug and returns a valid sort object which mongoose identifies
  // incoming sort slug has to be one of the values of this object
  const availableSortingOptions: { [key: string]: MongooseSortInput } = {
    announceDate: { _id: -1 },
    eventDate: { serviceDate: 1 },
    name: {
      firstName: 1,
      lastName: 1,
    },
  } as const

  // set default value for sort if not specified
  let sortObject: MongooseSortInput = { _id: 1 }
  const sortSlug = 'announceDate'

  // if sort is valid => replace the default sort with new mongoose sort object received from the mapper
  const isSortValid = req.query.sorting && Object.keys(availableSortingOptions).includes(req.query.sorting)
  if (isSortValid) sortObject = availableSortingOptions[sortSlug]

  // filter by type if specified
  const type = req.query.type
  if (type) filters.type = type

  await Announcement.find(filters)
    .sort(sortObject)
    .then((result) => {
      res.send(result)
    })
})

router.get('/:id', oid, async (req: CustomRequest<{}, { id: string }>, res: Response) => {
  await Announcement.findById(req.params.id).then((result) => {
    if (!result) return res.status(404).send('Announcement item with the given id not found!')

    res.send(result)
  })
})

// post methods
router.post('/', async (req: CustomRequest<AnnouncementDocument>, res: Response) => {
  const { valid, message } = Announcement.validatePayload(req.body)
  if (!valid) res.status(400).send(errorMessage(message))

  // req.userId is guaranteed to exist because of auth middleware
  const incomingItem = Announcement.createFromRequest(req.body, req.userId!)
  await incomingItem.save().then((result) => res.send(result))
})

// put method
router.put('/:id', oid, async (req: CustomRequest<AnnouncementDocument, { id: string }>, res: Response) => {
  const { valid, message } = Announcement.validatePayload(req.body)
  if (!valid) res.status(400).send(errorMessage(message))

  await Announcement.findByIdAndUpdate(req.params.id, req.body).then((result) => {
    if (!result) return res.status(404).send('Announcement item with the given id not found!')

    res.send(result)
  })
})

// delete method
router.delete('/:id', oid, async (req: CustomRequest<{}, { id: string }>, res: Response) => {
  await Announcement.findByIdAndDelete(req.params.id).then((result) => {
    if (!result) return res.status(404).send('Announcement item with the given id not found!')

    res.send(result)
  })
})

export default router
