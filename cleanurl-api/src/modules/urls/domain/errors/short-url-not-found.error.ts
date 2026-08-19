export class ShortUrlNotFoundError extends Error {
  constructor(message = 'URL curta não encontrada.') {
    super(message);
    this.name = 'ShortUrlNotFoundError';
  }
}