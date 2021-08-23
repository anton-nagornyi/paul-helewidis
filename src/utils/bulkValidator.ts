import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { enumToStrings } from './enumToStrings';
import { BulkVerb } from '../types';

export const bulkValidator = () => {
  const schema = Joi.object({
    url: Joi.string().required(),
    verb: Joi.string().valid(...enumToStrings(BulkVerb)).required(),
    body: Joi.object().unknown(true),
    payload: Joi.array().items(Joi.object({
      variables: Joi.object().unknown(true).required(),
    })).min(1),
  });

  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.validate(request.body);
    if (result.error) {
      return next(result.error);
    }

    return next();
  };
};
