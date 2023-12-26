import mongoose from 'mongoose'
import Joi from 'joi'
import { Response } from 'express'
import { errorMessage } from '../helpers/core'
import jwt from 'jsonwebtoken'

export interface UserDocument {
  email: string
  password?: string
  generateAuthToken(): string
  name?: string
  address?: string
  city?: string
  homepage?: string
  description?: string
  logo?: string
  iban?: number
  bic?: string
  stripeAccount?: string
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
  postalCode: {
    type: String,
    minLength: 5,
    maxLength: 20,
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
})

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET!)
}

export function validateUser(body: UserDocument, res: Response) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    name: Joi.string().min(3).max(50).allow(''),
    address: Joi.string().min(5).max(500).allow(''),
    city: Joi.string().min(3).max(20).allow(''),
    homepage: Joi.string().min(5).max(50).allow(''),
    description: Joi.string().min(5).max(150).allow(''),
    logo: Joi.string().min(5).max(50).allow(''),
    iban: Joi.string().min(5).max(30).allow(''),
    bic: Joi.string().min(5).max(30).allow(''),
    stripeAccount: Joi.string().min(5).max(30).allow(''),
    postalCode: Joi.string().min(5).max(30).allow(''),
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
