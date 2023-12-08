import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { errorMessage } from '../helpers/core'
import { CustomRequest } from '../types/global'

export default function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies['auth-token']

  if (!token)
    return res
      .status(401)
      .send(errorMessage('Access denied. No token provided'))

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    if (typeof decoded !== 'string') req.user = { _id: decoded._id }

    next()
  } catch (e) {
    res.status(400).send(errorMessage('Invalid token: ' + e))
  }
}
