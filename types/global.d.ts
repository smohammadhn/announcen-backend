import { Request } from 'express'

declare global {
  interface CustomRequest extends Request {
    userId?: string
  }
}

export { CustomRequest }
