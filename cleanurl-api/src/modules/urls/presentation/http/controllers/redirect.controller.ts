import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Redirect,
} from '@nestjs/common';

import { ResolveShortUrlUseCase } from '../../../application/use-cases/resolve-short-url.use-case';

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
    const result = await this.resolveShortUrlUseCase.execute({
      shortCode,
    });

    return {
      url: result.originalUrl,
    };
  }
}