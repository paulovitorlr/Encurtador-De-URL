export class InvalidOriginalUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOriginalUrlError';
  }
}