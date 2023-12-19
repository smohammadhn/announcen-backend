import mongoose from 'mongoose'
import Joi from 'joi'
import { Response } from 'express'
import { errorMessage } from '../helpers/core'

const announcementSchema = new mongoose.Schema({
  dateOfBirth: String,
  dateOfDeath: String,
  funeralTime: String,
  serviceDate: String,
  serviceTime: String,
  closestFamilyCircle: Boolean,
  familyRoles: [String],
  type: { type: String },
  firstName: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true,
  },
  partnerName: {
    type: String,
    minLength: 3,
    maxLength: 50,
  },
  city: {
    type: String,
    minLength: 3,
    maxLength: 20,
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married'],
  },
  placeOfBirth: {
    type: String,
    minLength: 3,
    maxLength: 500,
  },
  servicePlace: {
    type: String,
    minLength: 3,
    maxLength: 500,
  },
  funeralPlace: {
    type: String,
    minLength: 3,
    maxLength: 500,
  },
  specialThanks: {
    type: String,
    minLength: 3,
    maxLength: 1000,
  },

  relatives: [
    {
      type: String,
      name: {
        type: String,
        minLength: 3,
        maxLength: 50,
      },
      partnerName: {
        type: String,
        minLength: 3,
        maxLength: 50,
      },
      city: {
        type: String,
        minLength: 3,
        maxLength: 20,
      },
      children: {
        type: String,
        enum: ['yes', 'no'],
      },
    },
  ],

  nonProfits: [
    {
      name: {
        type: String,
        minLength: 3,
        maxLength: 100,
      },
    },
  ],
})

export type AnnouncementDocument = mongoose.InferSchemaType<typeof announcementSchema>

export function validateAnnouncement(body: AnnouncementDocument, res: Response) {
  const schema = Joi.object({
    firstName: Joi.string().required().min(5).max(50),
    lastName: Joi.string().required().min(5).max(50),
    partnerName: Joi.string().min(3).max(50),

    address: Joi.string().min(3).max(500),
    placeOfBirth: Joi.string().min(3).max(500),
    placeOfDeath: Joi.string().min(3).max(500),
    funeralPlace: Joi.string().min(3).max(500),
    servicePlace: Joi.string().min(3).max(500),
    specialThanks: Joi.string().min(3).max(1000),
    city: Joi.string().min(3).max(20),

    familyRoles: Joi.array().items(Joi.string()),

    maritalStatus: Joi.valid('single', 'married'),

    dateOfBirth: Joi.string().length(10),
    dateOfDeath: Joi.string().length(10),
    serviceDate: Joi.string().length(10),

    serviceTime: Joi.string().length(5),
    funeralTime: Joi.string().length(5),

    type: Joi.string(),
    closestFamilyCircle: Joi.boolean(),

    relatives: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required().min(5).max(50),
        partnerName: Joi.string().required().min(5).max(50),
        children: Joi.string().valid('yes', 'no'),
        city: Joi.string().min(3).max(20),
      })
    ),
    nonProfits: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required().min(5).max(50),
      })
    ),
  })

  const { error } = schema.validate(body)

  const result = {
    valid: error == null,
    message: error ? error.details[0].message : null,
  }

  if (!result.valid) res.status(400).send(errorMessage(result.message))

  return result.valid
}

export default mongoose.model<AnnouncementDocument>('Announcement', announcementSchema)
