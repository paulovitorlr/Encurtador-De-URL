export class ShortUrlExpiredError extends Error {
  constructor() {
    super('A URL curta está expirada.');
    this.name = 'ShortUrlExpiredError';
  }
}