import Joi from 'joi'
import _ from 'lodash'
import mongoose from 'mongoose'

const relativeSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 50,
  },
  partnerName: {
    type: String,
    maxLength: 50,
  },
  city: {
    type: Number,
    ref: 'City',
  },
  children: {
    type: String,
    enum: ['yes', 'no'],
  },
})

const announcementSchema = new mongoose.Schema(
  {
    dateOfBirth: String,
    dateOfDeath: String,
    funeralTime: String,
    serviceDate: String,
    serviceTime: String,
    closestFamilyCircle: Boolean,
    familyRoles: [String],
    relatives: [relativeSchema],

    nonProfits: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Organization',
      },
    ],

    userId: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => v && v.length === 24,
        message: 'exactly 24 chars',
      },
    },

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
      maxLength: 50,
    },
    city: {
      type: Number,
      ref: 'City',
    },
    maritalStatus: {
      type: String,
    },
    type: {
      type: String,
      enum: ['birth', 'death', 'wedding'],
    },
    placeOfBirth: {
      type: String,
      minLength: 3,
      maxLength: 500,
    },
    placeOfDeath: {
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
    obituary: {
      type: String,
      minLength: 10,
      maxLength: 5000,
    },
  },
  { timestamps: true }
)

export type AnnouncementDocument = mongoose.InferSchemaType<typeof announcementSchema> & {
  createdAt: Date
  updatedAt: Date
}

interface AnnouncementModel extends mongoose.Model<AnnouncementDocument> {
  validatePayload: (body: AnnouncementDocument) => { valid: boolean; message: string | null }
  createFromRequest: (body: AnnouncementDocument, userId: string) => mongoose.Document<AnnouncementDocument>
}

announcementSchema.statics.createFromRequest = function (body: AnnouncementDocument, userId: string) {
  const allowedFields = Object.keys(this.schema.paths).filter((field) => field !== '_id' && field !== '__v')

  const filteredBody = _.pick(body, allowedFields)
  filteredBody.userId = userId

  return new this(filteredBody)
}

announcementSchema.statics.validatePayload = function (body: AnnouncementDocument) {
  const schema = Joi.object({
    firstName: Joi.string().required().min(3).max(50),
    lastName: Joi.string().required().min(3).max(50),
    partnerName: Joi.string().allow('').min(3).max(50),
    address: Joi.string().min(3).max(500),
    placeOfBirth: Joi.string().min(3).max(500),
    placeOfDeath: Joi.string().min(3).max(500),
    funeralPlace: Joi.string().min(3).max(500),
    servicePlace: Joi.string().min(3).max(500),
    specialThanks: Joi.string().min(3).max(1000),
    obituary: Joi.string().required().min(10).max(5000),
    city: Joi.number(),
    familyRoles: Joi.array().items(Joi.string()),
    maritalStatus: Joi.string().allow(null).valid('single', 'married', 'partner', 'husband', 'wife'),
    dateOfBirth: Joi.string().length(10),
    dateOfDeath: Joi.string().length(10),
    serviceDate: Joi.string().length(10),
    serviceTime: Joi.string().length(5),
    funeralTime: Joi.string().length(5),
    type: Joi.string(),
    closestFamilyCircle: Joi.boolean(),
    relatives: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required().min(3).max(50),
        partnerName: Joi.string().allow('').min(5).max(50),
        children: Joi.string().valid('yes', 'no'),
        city: Joi.number().allow(null),
      })
    ),
    nonProfits: Joi.array().items(Joi.string()),
  })

  const { error } = schema.validate(body)

  return {
    valid: error == null,
    message: error ? error.details[0].message : null,
  }
}

announcementSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.__v
  },
})

export default mongoose.model<AnnouncementDocument, AnnouncementModel>('Announcement', announcementSchema)
