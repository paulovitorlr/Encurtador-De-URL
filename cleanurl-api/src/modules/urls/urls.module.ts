import { Module } from '@nestjs/common';

import {
  createShortUrlUseCaseProvider,
  resolveShortUrlUseCaseProvider,
  shortCodeGeneratorProvider,
  shortUrlRepositoryProvider,
} from './infrastructure/DI/urls.providers';
import { RedirectController } from './presentation/http/controllers/redirect.controller';
import { UrlsController } from './presentation/http/controllers/urls.controller';

@Module({
  controllers: [
    UrlsController,
    RedirectController,
  ],
  providers: [
    shortUrlRepositoryProvider,
    shortCodeGeneratorProvider,
    createShortUrlUseCaseProvider,
    resolveShortUrlUseCaseProvider,
  ],
})
export class UrlsModule {}