import mongoose from 'mongoose'

const citySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  municipality: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
})

export type CityDocument = mongoose.InferSchemaType<typeof citySchema>

citySchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.__v
    delete ret._id
  },
})

export default mongoose.model<CityDocument>('City', citySchema)
