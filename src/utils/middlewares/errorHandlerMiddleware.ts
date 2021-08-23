import { NextFunction, Request, Response } from 'express';
import * as Joi from 'joi';
import { BaseError } from '../errors/BaseError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandlerMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.response && error.response.data) {
    return res.status(error.response.status).json(error.response.data);
  }
  let { message } = error;
  const errors = error.details ? error.details : error.errors;
  if (Array.isArray(errors)) {
    message = errors.length > 1 ? errors.map((e: any) => e.message) : errors[0].message;
  }

  if (error instanceof BaseError) {
    return res.status(error.status).json({
      error: true,
      code: error.code,
      message,
    });
  }
  if (error instanceof Joi.ValidationError) {
    return res.status(400).json({
      error: true,
      code: 'BULK_REQUEST_VALIDATION',
      message,
    });
  }

  return res.status(500).json({
    error: true,
    code: 'BULK_INTERNAL',
    message,
  });
};
