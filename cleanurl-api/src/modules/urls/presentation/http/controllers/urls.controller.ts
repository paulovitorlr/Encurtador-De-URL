import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateShortUrlUseCase } from '../../../application/use-cases/create-short-url.use-case';
import { InvalidOriginalUrlError } from '../../../domain/errors/invalid-original-url.error';
import { CreateShortUrlDto } from '../DTOs/create-short-url.dto';
import { CreateShortUrlResponseDto } from '../DTOs/create-short-url-response.dto';

@Controller('api/v1/urls')
export class UrlsController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly configService: ConfigService,
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

    const shortUrlBaseUrl = this.configService.getOrThrow<string>(
      'SHORT_URL_BASE_URL',
    );

    const fullShortUrl = `${shortUrlBaseUrl}/${shortUrl.shortCode}`;

    

    return new CreateShortUrlResponseDto({
      shortCode: shortUrl.shortCode,
      originalUrl: shortUrl.originalUrl,
      shortUrl: fullShortUrl,
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