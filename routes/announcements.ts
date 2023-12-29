import express, { Response } from 'express'
import oid from '../middlewares/oid'
import Announcement, { validateAnnouncement, AnnouncementDocument } from '../models/announcement'
import _ from 'lodash'
import moment from 'moment'
import { SortOrder } from 'mongoose'

const router = express.Router()

// get methods
router.get('/', async (req: CustomRequest, res: Response) => {
  const type = req.query.type
  let sortParams: { [key: string]: SortOrder } = { _id: 1 }

  const sortingMapper: { [key: string]: typeof sortParams } = {
    announceDate: { _id: -1 },
    eventDate: { serviceDate: 1 },
    name: {
      firstName: 1,
      lastName: 1,
    },
  } as const

  const sort = req.query.sorting as keyof typeof sortingMapper
  if (sort) sortParams = sortingMapper[sort || 'announceDate']

  const filters = { userId: req.userId, ...(type && { type }) }

  await Announcement.find(filters)
    .sort(sortParams)
    .then((result) => {
      res.send(result)
    })
})

router.get('/:id', oid, async (req: CustomRequest, res: Response) => {
  await Announcement.findById(req.params.id).then((result) => {
    if (!result) return res.status(404).send('Announcement item with the given id not found!')

    res.send(result)
  })
})

// post methods
router.post('/', async (req: CustomRequest, res: Response) => {
  if (!validateAnnouncement(req.body, res)) return

  const result = _.pick(req.body, [
    'dateOfBirth',
    'dateOfDeath',
    'funeralTime',
    'serviceDate',
    'serviceTime',
    'closestFamilyCircle',
    'familyRoles',
    'type',
    'firstName',
    'lastName',
    'partnerName',
    'city',
    'maritalStatus',
    'placeOfBirth',
    'placeOfDeath',
    'servicePlace',
    'funeralPlace',
    'specialThanks',
    'relatives',
    'nonProfits',
    'obituary',
  ]) as AnnouncementDocument

  result.createdAt = moment().toISOString()
  if (req.userId) result.userId = req.userId

  const incomingItem = new Announcement(result)
  await incomingItem.save().then((result) => res.send(result))
})

// put method
// router.put('/:id', oid, async (req: Request, res: Response) => {
//   if (!validateAnnouncement(req.body, res)) return

//   await Announcement.findByIdAndUpdate(req.params.id, req.body).then((result) => {
//     if (!result)
//       return res.status(404).send('Announcement item with the given id not found!')

//     res.send(result)
//   })
// })

// delete method
// router.delete('/:id', oid, async (req: Request, res: Response) => {
//   await Announcement.findByIdAndRemove(req.params.id).then((result) => {
//     if (!result)
//       return res.status(404).send('Announcement item with the given id not found!')

//     res.send(result)
//   })
// })

export = router
