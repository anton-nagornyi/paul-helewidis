import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/NotFoundError';

export const noRouteMiddleware = (request: Request, response: Response, next: NextFunction) => {
  next(new NotFoundError('Route'));
};
