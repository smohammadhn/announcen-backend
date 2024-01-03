import { Request } from 'express'
import { SortOrder } from 'mongoose'

export {}

declare global {
  // order: B:request body, P:params, Q:query
  type CustomRequest<B = {}, P = {}, Q = {}> = Request<P, {}, B, Q> & {
    userId?: string
  }

  type MongooseSortInput = Record<string, SortOrder>
}
