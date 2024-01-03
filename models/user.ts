import mongoose from 'mongoose'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import _ from 'lodash'

const userSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
)

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> & {
  createdAt: Date
  updatedAt: Date
  generateAuthToken: () => string
  checkPassword: (password: string) => Promise<boolean>
  isModified(path?: string): boolean
}

interface UserModel extends mongoose.Model<UserDocument> {
  validateLogin: (body: UserDocument) => { valid: boolean; message: string | null }
  createFromRequest: (body: UserDocument) => mongoose.Document<UserDocument>
}

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET!)
}

userSchema.methods.checkPassword = async function (password: string) {
  await bcrypt.compare(password, this.password)
}

userSchema.statics.validateLogin = function (body: UserDocument) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(50),
  })

  const { error } = schema.validate(body)

  return {
    valid: error == null,
    message: error ? error.details[0].message : null,
  }
}

userSchema.statics.createFromRequest = function (body: UserDocument) {
  const allowedFields = Object.keys(this.schema.paths).filter((field) => field !== '_id' && field !== '__v')

  const filteredBody = _.pick(body, allowedFields)
  return new this(filteredBody)
}

userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.__v
    delete ret.password
  },
})

export default mongoose.model<UserDocument, UserModel>('User', userSchema)
