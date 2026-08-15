import { describe, expect, it, jest } from '@jest/globals';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { ShortCode } from '../../domain/value-objects/short-code.value-object';
import { ShortCodeGenerator } from '../ports/short-code-generator';
import { CreateShortUrlUseCase } from './create-short-url.use-case';

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
    expect(result.shortCode).toBe(generatedShortCode);

    expect(shortCodeGenerator.generate).toHaveBeenCalledTimes(1);
    expect(shortUrlRepository.save).toHaveBeenCalledTimes(1);
    expect(shortUrlRepository.save).toHaveBeenCalledWith(result);
  });
});