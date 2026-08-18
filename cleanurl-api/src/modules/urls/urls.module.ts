import { Module } from '@nestjs/common';
import {
  createShortUrlUseCaseProvider,
  shortCodeGeneratorProvider,
  shortUrlRepositoryProvider,
  resolveShortUrlUseCaseProvider
} from './infrastructure/DI/urls.providers';
import { UrlsController } from './presentation/http/controllers/urls.controller';

@Module({
  controllers: [UrlsController],
  providers: [
    shortUrlRepositoryProvider,
    shortCodeGeneratorProvider,
    createShortUrlUseCaseProvider,
    resolveShortUrlUseCaseProvider,
  ],
})
export class UrlsModule {}