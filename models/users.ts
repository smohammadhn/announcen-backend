import mongoose from 'mongoose'
import Joi from 'joi'
import { Response } from 'express'

export interface ContactDocument {
  slug: string
  value: string
}

const contactSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    unique: true,
  },
  value: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
})

export function validateContact(body: ContactDocument, res: Response) {
  const schema = Joi.object({
    slug: Joi.string().required().min(3).max(20),
    value: Joi.string().required().min(3).max(100),
  })

  const { error } = schema.validate(body)

  const result = {
    valid: error == null,
    message: error ? error.details[0].message : null,
  }

  if (!result.valid) res.status(400).send(result.message)

  return result.valid
}

export default mongoose.model<ContactDocument>('Contact', contactSchema)
