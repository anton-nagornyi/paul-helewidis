export abstract class BaseError extends Error {
  constructor(readonly code: string, readonly status: number, readonly message: string) {
    super(message);
  }
}
