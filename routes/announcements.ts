import express, { Response } from 'express'
import oid from '../middlewares/oid'
import Announcement, { validateAnnouncement, AnnouncementDocument } from '../models/announcement'
import _ from 'lodash'

const router = express.Router()

type SortingItems = 'announceDate' | 'eventDate' | 'name'

// get methods
router.get('/', async (req: CustomRequest, res: Response) => {
  const type = req.query.type
  const sorting = req.query.sorting || '_id'
  const sortingMapper = {
    announceDate: '_id',
    eventDate: 'serviceDate',
    name: [
      ['firstName', 1],
      ['lastName', 1],
    ],
  } as any

  const filters = { userId: req.userId, ...(type && { type }) }

  await Announcement.find(filters)
    .sort(sortingMapper[sorting as SortingItems])
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
