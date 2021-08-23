export class RateLimitError extends Error {
  constructor() {
    super('Too many requests');
    (this as any).response = { status: 429, statusText: 'Too many requests' };
  }
}
