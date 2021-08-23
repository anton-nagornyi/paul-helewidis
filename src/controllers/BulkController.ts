import { Request, Response, NextFunction } from 'express';
import { Action } from '../types';
import { BulkService } from '../services/BulkService';

export class BulkController {
  constructor(private readonly service = new BulkService()) {}

  executeBulkAction = async (req: Request<{}, {}, Action>, res: Response, next: NextFunction) => {
    try {
      const action = req.body;
      return res.json((await this.service.executeBulkAction(action)));
    } catch (e) {
      return next(e);
    }
  };
}
