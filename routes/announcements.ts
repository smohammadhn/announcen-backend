import express, { Response } from 'express'
import { errorMessage } from '@/helpers/core'
import oid from '@/middlewares/oid'
import Announcement, { AnnouncementDocument } from '@/models/announcement'

interface IGetAnnouncementQuery {
  type?: string
  sorting?: string
}

// acts as a mapper: receives sort slug and returns a valid sort object which mongoose identifies
// incoming sort slug has to be one of the values of this object
const availableSortingOptions: Record<string, MongooseSortInput> = {
  announceDate: { _id: -1 },
  eventDate: { serviceDate: 1 },
  name: {
    firstName: 1,
    lastName: 1,
  },
}

const router = express.Router()

// get methods
router.get('/', async (req: CustomRequest<{}, {}, IGetAnnouncementQuery>, res: Response) => {
  // set default value for sort if not specified
  let sortObject: MongooseSortInput = { _id: 1 }
  const sortSlug = req.query.sorting

  // if sort is valid => replace the default sort with new mongoose sort object received from the mapper
  const isSortValid = sortSlug && Object.keys(availableSortingOptions).includes(sortSlug)
  if (isSortValid) sortObject = availableSortingOptions[sortSlug]

  // filter by type if specified
  const filters: {
    type?: AnnouncementDocument['type']
  } = {}
  const type = req.query.type
  if (type) filters.type = type

  await Announcement.find(filters)
    .populate({
      path: 'city',
      model: 'City',
      foreignField: 'id',
    })
    .sort(sortObject)
    .then((result) => {
      res.send(result)
    })
})

router.get('/own', async (req: CustomRequest<{}, {}, IGetAnnouncementQuery>, res: Response) => {
  await Announcement.find({ userId: req.userId! })
    .populate({
      path: 'city',
      model: 'City',
      foreignField: 'id',
    })
    .then((result) => {
      res.send(result)
    })
})

router.get('/:id', oid, async (req: CustomRequest<{}, { id: string }>, res: Response) => {
  await Announcement.findById(req.params.id)
    .populate({
      path: 'city',
      model: 'City',
      foreignField: 'id',
    })
    .populate('nonProfits')
    .then((result) => {
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
