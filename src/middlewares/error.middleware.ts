import { Request, Response, NextFunction } from 'express';
import { ErrorFramework } from '../utils/error';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ErrorFramework) {
    return res.status(err.statusCode).json({
      status: 0,
      message: err.message
    });
  } 

  return res.status(500).json({
    status: 0,
    message: 'Something went wrong'
  });
}