import { NextFunction, Request, Response } from 'express'

export default function (req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', process.env.WEBSITE_URL!)
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, PATCH'
  )

  next()
}
