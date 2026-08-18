import { Module } from '@nestjs/common';
import {
  createShortUrlUseCaseProvider,
  shortCodeGeneratorProvider,
  shortUrlRepositoryProvider,
  resolveShortUrlUseCaseProvider
} from './infrastructure/DI/urls.providers';

@Module({
  providers: [
    shortUrlRepositoryProvider,
    shortCodeGeneratorProvider,
    createShortUrlUseCaseProvider,
    resolveShortUrlUseCaseProvider,
  ],
})
export class UrlsModule {}