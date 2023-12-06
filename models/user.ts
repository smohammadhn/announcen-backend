import mongoose from 'mongoose'
import Joi from 'joi'
import { Response } from 'express'
import { errorMessage } from '../helpers/core'

export interface UserDocument {
  name: string
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
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
})

export function validateUser(body: UserDocument, res: Response) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(50),
  })

  const { error } = schema.validate(body)

  const result = {
    valid: error == null,
    message: error ? error.details[0].message : null,
  }

  if (!result.valid) res.status(400).send(errorMessage(result.message))

  return result.valid
}

export default mongoose.model<UserDocument>('User', userSchema)
