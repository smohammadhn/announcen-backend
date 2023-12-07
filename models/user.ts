import mongoose from 'mongoose'
import Joi from 'joi'
import { Response } from 'express'
import { errorMessage } from '../helpers/core'
import jwt from 'jsonwebtoken'
import config from 'config'

export interface UserDocument {
  email: string
  password: string
  generateAuthToken(): string
  name?: string
  address: string
  city: string
  homepage: string
  description: string
  logo: string
  iban: number
  bic: string
  stripeAccount: string
}

const userSchema = new mongoose.Schema({
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
    maxLength: 50,
  },
  address: {
    type: String,
    minLength: 5,
    maxLength: 500,
  },
  city: {
    type: String,
    minLength: 3,
    maxLength: 20,
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
  logo: {
    type: String,
    minLength: 10,
    maxLength: 1000,
  },
  iban: {
    type: Number,
    minLength: 10,
    maxLength: 50,
  },
  bic: {
    type: Number,
    minLength: 10,
    maxLength: 50,
  },
  stripeAccount: {
    type: Number,
    minLength: 10,
    maxLength: 50,
  },
})

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, config.get('jwtSecret'))
}

export function validateUser(body: UserDocument, res: Response) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(50),
    name: Joi.string().min(5).max(50),
    address: Joi.string().min(5).max(50),
    city: Joi.string().min(5).max(50),
    homepage: Joi.string().min(5).max(50),
    description: Joi.string().min(5).max(50),
    logo: Joi.string().min(5).max(50),
    iban: Joi.number().min(5).max(50),
    bic: Joi.string().min(5).max(50),
    stripeAccount: Joi.string().min(5).max(50),
  })

  const { error } = schema.validate(body)

  const result = {
    valid: error == null,
    message: error ? error.details[0].message : null,
  }

  if (!result.valid) res.status(400).send(errorMessage(result.message))

  return result.valid
}

export function validateLogin(body: UserDocument, res: Response) {
  const schema = Joi.object({
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
