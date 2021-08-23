import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(resource: string) {
    super('NOT_FOUND', 404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}
