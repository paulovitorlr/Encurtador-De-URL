import { ShortUrl } from '../../domain/entities/short-url.entity';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { OriginalUrl } from '../../domain/value-objects/original-url.value-object';
import { ShortCodeGenerator } from '../ports/short-code-generator';

export interface CreateShortUrlInput {
  originalUrl: string;
  ownerId: string;
  expiresAt?: Date;
}

export class CreateShortUrlUseCase {
  constructor(
    private readonly shortUrlRepository: ShortUrlRepository,
    private readonly shortCodeGenerator: ShortCodeGenerator,
  ) {}

  async execute(input: CreateShortUrlInput): Promise<ShortUrl> {
    const originalUrl = OriginalUrl.create(input.originalUrl);
    const shortCode = this.shortCodeGenerator.generate();

    const shortUrl = ShortUrl.create({
      originalUrl,
      shortCode,
      ownerId: input.ownerId,
      expiresAt: input.expiresAt,
    });

    await this.shortUrlRepository.save(shortUrl);

    return shortUrl;
  }
}