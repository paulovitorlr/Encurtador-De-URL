import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { ShortCode } from '../../domain/value-objects/short-code.value-object';
import { ShortUrlExpiredError } from '../../domain/errors/short-url-expired.error';
import { ShortUrlNotFoundError } from '../../domain/errors/short-url-not-found.error';

interface ResolveShortUrlInput {
  shortCode: string;
}

interface ResolveShortUrlOutput {
  originalUrl: string;
}

export class ResolveShortUrlUseCase {
  constructor(private readonly shortUrlRepository: ShortUrlRepository) {}

  async execute(
  input: ResolveShortUrlInput,
): Promise<ResolveShortUrlOutput> {
  const shortCode = ShortCode.create(input.shortCode);

  const shortUrl =
    await this.shortUrlRepository.findByShortCode(shortCode);

  if (!shortUrl) {
    throw new ShortUrlNotFoundError();
  }

  if (shortUrl.isExpired()) {
    throw new ShortUrlExpiredError();
  }

  return {
    originalUrl: shortUrl.originalUrl.value,
  };
}
}