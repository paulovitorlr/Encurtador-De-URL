import { ShortUrl } from '../../domain/entities/short-url.entity';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { OriginalUrl } from '../../domain/value-objects/original-url.value-object';
import { ShortCodeGenerator } from '../ports/short-code-generator';
import { ShortCode } from '../../domain/value-objects/short-code.value-object';

export interface CreateShortUrlInput {
  originalUrl: string;
  ownerId: string;
}

export interface CreateShortUrlOutput {
  originalUrl: string;
  shortCode: string;
  ownerId: string;
  createdAt: Date;
  expiresAt: Date;
}

export class CreateShortUrlUseCase {
  private static readonly MAX_CODE_GENERATION_ATTEMPTS = 5;
  private static readonly DEFAULT_EXPIRATION_DAYS = 30;

  constructor(
    private readonly shortUrlRepository: ShortUrlRepository,
    private readonly shortCodeGenerator: ShortCodeGenerator,
  ) {}

  async execute(input: CreateShortUrlInput): Promise<CreateShortUrlOutput> {
    const originalUrl = OriginalUrl.create(input.originalUrl);
    const shortCode = await this.generateUniqueShortCode();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);

    expiresAt.setUTCDate(
      expiresAt.getUTCDate() +
      CreateShortUrlUseCase.DEFAULT_EXPIRATION_DAYS,
    );

    const shortUrl = ShortUrl.create({
      originalUrl,
      shortCode,
      ownerId: input.ownerId,
      expiresAt:expiresAt,
    });

    await this.shortUrlRepository.save(shortUrl);

    return {
        originalUrl: shortUrl.originalUrl.value,
        shortCode: shortUrl.shortCode.value,
        ownerId: shortUrl.ownerId,
        createdAt: shortUrl.createdAt,
        expiresAt: expiresAt,
    };
  }

  private async generateUniqueShortCode(): Promise<ShortCode> {
    for (
      let attempt = 0;
      attempt < CreateShortUrlUseCase.MAX_CODE_GENERATION_ATTEMPTS;
      attempt++
    ) {
      const shortCode = this.shortCodeGenerator.generate();

      const existingShortUrl =
        await this.shortUrlRepository.findByShortCode(shortCode);

      if (!existingShortUrl) {
        return shortCode;
      }
    }

    throw new Error(
      'Não foi possível gerar um código curto único.',
    );
  }
}