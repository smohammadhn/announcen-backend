import mongoose from 'mongoose'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import _ from 'lodash'

const organizationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
    },
    name: {
      type: String,
      minLength: 5,
      maxLength: 500,
    },
    address: {
      type: String,
      minLength: 5,
      maxLength: 500,
    },
    city: {
      type: Number,
      ref: 'City',
    },
    homepage: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    description: {
      type: String,
      minLength: 5,
      maxLength: 150,
    },
    postalCode: {
      type: String,
      maxLength: 4,
    },
    logo: {
      type: String,
      minLength: 10,
      maxLength: 1000,
    },
    iban: {
      type: String,
      minLength: 10,
      maxLength: 50,
    },
    bic: {
      type: String,
      minLength: 5,
      maxLength: 30,
    },
    stripeAccount: {
      type: String,
      minLength: 5,
      maxLength: 30,
    },
  },
  { timestamps: true }
)

export type OrganizationDocument = mongoose.InferSchemaType<typeof organizationSchema> & {
  createdAt: Date
  updatedAt: Date
  checkPassword: (password: string) => Promise<boolean>
  isModified(path?: string): boolean
}

interface OrganizationModel extends mongoose.Model<OrganizationDocument> {
  validateOrganization: (body: OrganizationDocument) => { valid: boolean; message: string | null }
  createFromRequest: (body: OrganizationDocument) => mongoose.Document<OrganizationDocument>
}

organizationSchema.methods.checkPassword = async function (password: string) {
  await bcrypt.compare(password, this.password)
}

organizationSchema.statics.validateOrganization = function (body: OrganizationDocument) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(50),
    name: Joi.string().min(3).max(500).allow(''),
    address: Joi.string().min(5).max(500).allow(''),
    city: Joi.number(),
    homepage: Joi.string().min(5).max(50).allow(''),
    description: Joi.string().min(5).max(150).allow(''),
    logo: Joi.string().min(5).max(50).allow(''),
    iban: Joi.string().min(5).max(30).allow(''),
    bic: Joi.string().min(5).max(30).allow(''),
    stripeAccount: Joi.string().min(5).max(30).allow(''),
    postalCode: Joi.string().length(4).allow(''),
  })

  const { error } = schema.validate(body)

  return {
    valid: error == null,
    message: error ? error.details[0].message : null,
  }
}

organizationSchema.statics.createFromRequest = function (body: OrganizationDocument) {
  const allowedFields = Object.keys(this.schema.paths).filter((field) => field !== '_id' && field !== '__v')

  const filteredBody = _.pick(body, allowedFields)
  return new this(filteredBody)
}

organizationSchema.pre<OrganizationDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

organizationSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.__v
    delete ret.password
  },
})

export default mongoose.model<OrganizationDocument, OrganizationModel>('Organization', organizationSchema)
