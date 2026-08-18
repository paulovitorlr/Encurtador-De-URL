import { Provider } from '@nestjs/common';

import { ResolveShortUrlUseCase } from '../../application/use-cases/resolve-short-url.use-case';

import { CreateShortUrlUseCase } from '../../application/use-cases/create-short-url.use-case';
import { ShortCodeGenerator } from '../../application/ports/short-code-generator';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';

import { InMemoryShortUrlRepository } from '../repositories/in-memory-short-url.repository';
import { RandomShortCodeGenerator } from '../generators/random-short-code.generator';
import {
  SHORT_CODE_GENERATOR,
  SHORT_URL_REPOSITORY,
} from '../DI/urls.token';

export const shortUrlRepositoryProvider: Provider = {
  provide: SHORT_URL_REPOSITORY,
  useClass: InMemoryShortUrlRepository,
};

export const shortCodeGeneratorProvider: Provider = {
  provide: SHORT_CODE_GENERATOR,
  useClass: RandomShortCodeGenerator,
};

export const createShortUrlUseCaseProvider: Provider = {
  provide: CreateShortUrlUseCase,
  inject: [SHORT_URL_REPOSITORY, SHORT_CODE_GENERATOR],
  useFactory: (
    shortUrlRepository: ShortUrlRepository,
    shortCodeGenerator: ShortCodeGenerator,
  ) =>
    new CreateShortUrlUseCase(
      shortUrlRepository,
      shortCodeGenerator,
    ),
};

export const resolveShortUrlUseCaseProvider: Provider = {
  provide: ResolveShortUrlUseCase,

  inject: [SHORT_URL_REPOSITORY],

  useFactory: (shortUrlRepository: ShortUrlRepository) =>
    new ResolveShortUrlUseCase(shortUrlRepository),
};