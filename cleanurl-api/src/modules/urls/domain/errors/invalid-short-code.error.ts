export class InvalidShortCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidShortCodeError';
  }
}