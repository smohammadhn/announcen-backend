import { Request } from 'express'

declare global {
  interface CustomRequest extends Request {
    user?: JwtPayload
  }
}

export { CustomRequest }
