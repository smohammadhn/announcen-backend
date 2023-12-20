import express, { Request, Response } from 'express'
import oid from '../middlewares/oid'
import Announcement, { validateAnnouncement, AnnouncementDocument } from '../models/announcement'
import _ from 'lodash'

const router = express.Router()

// get methods
router.get('/', async (req: Request, res: Response) => {
  await Announcement.find()
    .sort('_id')
    .then((result) => {
      res.send(result)
    })
})

router.get('/:id', oid, async (req: Request, res: Response) => {
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
    'servicePlace',
    'funeralPlace',
    'specialThanks',
    'relatives',
    'nonProfits',
  ]) as AnnouncementDocument

  if (req.userId) result.userId = req.userId

  console.log('result :>> ', result)

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
