import { describe, expect, it, jest } from '@jest/globals';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { ShortCode } from '../../domain/value-objects/short-code.value-object';
import { ShortCodeGenerator } from '../ports/short-code-generator';
import { CreateShortUrlUseCase } from './create-short-url.use-case';
import { ShortUrl } from '../../domain/entities/short-url.entity';
import { OriginalUrl } from '../../domain/value-objects/original-url.value-object';

describe('CreateShortUrlUseCase', () => {
  it('should create and save a shortened URL', async () => {
    const generatedShortCode = ShortCode.create('aB3dE7x');

    const shortUrlRepository: ShortUrlRepository = {
      save: jest
        .fn<ShortUrlRepository['save']>()
        .mockResolvedValue(undefined),

      findByShortCode: jest
        .fn<ShortUrlRepository['findByShortCode']>()
        .mockResolvedValue(null),
    };

    const shortCodeGenerator: ShortCodeGenerator = {
      generate: jest
        .fn<ShortCodeGenerator['generate']>()
        .mockReturnValue(generatedShortCode),
    };

    const useCase = new CreateShortUrlUseCase(
      shortUrlRepository,
      shortCodeGenerator,
    );

    const result = await useCase.execute({
      originalUrl: 'https://example.com/produtos/123',
      ownerId: 'user-123',
    });

    expect(result.ownerId).toBe('user-123');
    expect(result.shortCode).toBe(generatedShortCode.value);
    expect(result.originalUrl).toBe(
        'https://example.com/produtos/123',
    );
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.expiresAt).toBeUndefined();

    expect(shortCodeGenerator.generate).toHaveBeenCalledTimes(1);
    expect(shortUrlRepository.save).toHaveBeenCalledTimes(1);

  });

  it('should generate another code when the first code already exists', async () => {
  const firstCode = ShortCode.create('aB3dE7Q');
  const secondCode = ShortCode.create('xY7kL2M');

  const existingShortUrl = ShortUrl.create({
    originalUrl: OriginalUrl.create('https://existing-url.com'),
    shortCode: firstCode,
    ownerId: 'another-user',
  });

  const generatedCodes = [firstCode, secondCode];

  const shortCodeGenerator: ShortCodeGenerator = {
    generate: jest.fn(() => generatedCodes.shift()!),
  };

  const shortUrlRepository: ShortUrlRepository = {
  save: jest.fn(
    async (_shortUrl: ShortUrl): Promise<void> => undefined,
  ),

  findByShortCode: jest.fn(async (shortCode: ShortCode) => {
    if (shortCode === firstCode) {
      return existingShortUrl;
    }

    return null;
  }),
};

  const useCase = new CreateShortUrlUseCase(
    shortUrlRepository,
    shortCodeGenerator,
  );

  const result = await useCase.execute({
    originalUrl: 'https://example.com/new-product',
    ownerId: 'user-123',
  });

  expect(result.shortCode).toBe(secondCode.value);

  expect(shortCodeGenerator.generate).toHaveBeenCalledTimes(2);
  expect(shortUrlRepository.findByShortCode).toHaveBeenCalledTimes(2);

  expect(shortUrlRepository.save).toHaveBeenCalledTimes(1);
});

it('should fail after five short code collisions', async () => {
  const generatedShortCode = ShortCode.create('aB3dE7Q');

  const existingShortUrl = ShortUrl.create({
    originalUrl: OriginalUrl.create('https://existing-url.com'),
    shortCode: generatedShortCode,
    ownerId: 'another-user',
  });

  const shortCodeGenerator: ShortCodeGenerator = {
    generate: jest.fn(() => generatedShortCode),
  };

  const shortUrlRepository: ShortUrlRepository = {
    save: jest.fn(
      async (_shortUrl: ShortUrl): Promise<void> => undefined,
    ),

    findByShortCode: jest.fn(
      async (_shortCode: ShortCode) => existingShortUrl,
    ),
  };

  const useCase = new CreateShortUrlUseCase(
    shortUrlRepository,
    shortCodeGenerator,
  );

  await expect(
    useCase.execute({
      originalUrl: 'https://example.com/new-product',
      ownerId: 'user-123',
    }),
  ).rejects.toThrow('Não foi possível gerar um código curto único.');

  expect(shortCodeGenerator.generate).toHaveBeenCalledTimes(5);
  expect(shortUrlRepository.findByShortCode).toHaveBeenCalledTimes(5);
  expect(shortUrlRepository.save).not.toHaveBeenCalled();
});
});