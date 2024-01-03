import { Response, NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import { errorMessage } from '../helpers/core'

export default function (req: CustomRequest, res: Response, next: NextFunction) {
  const token = req.headers['authorization']

  if (!token) return res.status(401).send(errorMessage('Access denied. No token provided'))

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    if (typeof decoded !== 'string') req.userId = decoded._id

    next()
  } catch (e) {
    res.status(401).send(errorMessage('Invalid token: ' + e))
  }
}
