import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Redirect,
} from '@nestjs/common';

import { InvalidShortCodeError } from '../../../domain/errors/invalid-short-code.error';


import { ResolveShortUrlUseCase } from '../../../application/use-cases/resolve-short-url.use-case';
import { ShortUrlNotFoundError } from '../../../domain/errors/short-url-not-found.error';

@Controller()
export class RedirectController {
  constructor(
    private readonly resolveShortUrlUseCase: ResolveShortUrlUseCase,
  ) {}

@Get(':shortCode')
@Redirect(undefined, HttpStatus.FOUND)
async redirect(
  @Param('shortCode') shortCode: string,
): Promise<{ url: string }> {
  try {
    const result = await this.resolveShortUrlUseCase.execute({
      shortCode,
    });

    return {
      url: result.originalUrl,
    };
  } catch (error: unknown) {
    if (error instanceof InvalidShortCodeError) {
      throw new BadRequestException(error.message);
    }

    if (error instanceof ShortUrlNotFoundError) {
      throw new NotFoundException(error.message);
    }

    throw error;
  }
}
}