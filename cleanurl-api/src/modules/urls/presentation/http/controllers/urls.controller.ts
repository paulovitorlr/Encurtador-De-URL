import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateShortUrlUseCase } from '../../../application/use-cases/create-short-url.use-case';
import { CreateShortUrlDto } from '../DTOs/create-short-url.dto';
import { CreateShortUrlResponseDto } from '../DTOs/create-short-url-response.dto';
import { InvalidOriginalUrlError } from '../../../domain/errors/invalid-original-url.error';

@Controller('api/v1/urls')
export class UrlsController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
  ) {}

 @Post()
async create(
  @Body() dto: CreateShortUrlDto,
): Promise<CreateShortUrlResponseDto> {
  try {
    const shortUrl = await this.createShortUrlUseCase.execute({
      originalUrl: dto.originalUrl,
      ownerId: 'temporary-user-id',
    });

    return new CreateShortUrlResponseDto({
      shortCode: shortUrl.shortCode,
      originalUrl: shortUrl.originalUrl,
      createdAt: shortUrl.createdAt,
      expiresAt: shortUrl.expiresAt ?? null,
    });
  } catch (error: unknown) {
    if (error instanceof InvalidOriginalUrlError) {
      throw new BadRequestException(error.message);
    }

    throw error;
  }
}
}