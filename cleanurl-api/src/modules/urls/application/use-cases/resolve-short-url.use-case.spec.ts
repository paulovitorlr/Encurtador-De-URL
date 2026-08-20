import { describe, expect, it, jest } from '@jest/globals';
import { ShortUrl } from '../../domain/entities/short-url.entity';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';
import { OriginalUrl } from '../../domain/value-objects/original-url.value-object';
import { ShortCode } from '../../domain/value-objects/short-code.value-object';
import { ResolveShortUrlUseCase } from './resolve-short-url.use-case';


describe('ResolveShortUrlUseCase', () => {
  it('should return the original URL when the short code exists', async () => {
    const shortUrl = ShortUrl.create({
      originalUrl: OriginalUrl.create(
        'https://example.com/produtos/123',
      ),
      shortCode: ShortCode.create('aB3dE7x'),
      ownerId: 'user-123',
    });

    const shortUrlRepository: ShortUrlRepository = {
      save: jest.fn<ShortUrlRepository['save']>(),

      findByShortCode: jest
        .fn<ShortUrlRepository['findByShortCode']>()
        .mockResolvedValue(shortUrl),
    };

    const useCase = new ResolveShortUrlUseCase(shortUrlRepository);

    const result = await useCase.execute({
      shortCode: 'aB3dE7x',
    });

    expect(result.originalUrl).toBe(
      'https://example.com/produtos/123',
    );

    expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
      ShortCode.create('aB3dE7x'),
    );
  });

  it('should throw an error when the short code does not exist', async () => {
  const shortUrlRepository: ShortUrlRepository = {
    save: jest.fn<ShortUrlRepository['save']>(),

    findByShortCode: jest
      .fn<ShortUrlRepository['findByShortCode']>()
      .mockResolvedValue(null),
  };

  const useCase = new ResolveShortUrlUseCase(shortUrlRepository);

  await expect(
    useCase.execute({
      shortCode: 'aB3dE7x',
    }),
  ).rejects.toThrow('URL curta não encontrada.');

  expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
    ShortCode.create('aB3dE7x'),
  );
  });

  it('should not search the repository when the short code is invalid', async () => {
  const shortUrlRepository: ShortUrlRepository = {
    save: jest.fn<ShortUrlRepository['save']>(),

    findByShortCode:
      jest.fn<ShortUrlRepository['findByShortCode']>(),
  };

  const useCase = new ResolveShortUrlUseCase(shortUrlRepository);

  await expect(
    useCase.execute({
      shortCode: 'abc',
    }),
  ).rejects.toThrow();

  expect(shortUrlRepository.findByShortCode).not.toHaveBeenCalled();
});

it('should throw an error when the short URL has expired', async () => {
  const shortUrl = ShortUrl.create({
    originalUrl: OriginalUrl.create(
      'https://example.com/produtos/123',
    ),
    shortCode: ShortCode.create('aB3dE7x'),
    ownerId: 'user-123',
    createdAt: new Date('2020-01-01T10:00:00.000Z'),
    expiresAt: new Date('2020-01-01T11:00:00.000Z'),
  });

  const shortUrlRepository: ShortUrlRepository = {
    save: jest.fn<ShortUrlRepository['save']>(),

    findByShortCode: jest
      .fn<ShortUrlRepository['findByShortCode']>()
      .mockResolvedValue(shortUrl),
  };

  const useCase = new ResolveShortUrlUseCase(shortUrlRepository);

  
  

  await expect(
    useCase.execute({
      shortCode: 'aB3dE7x',
      
    }),
  ).rejects.toThrow('A URL curta está expirada.');

  expect(shortUrlRepository.findByShortCode).toHaveBeenCalledWith(
    ShortCode.create('aB3dE7x'),
    
  );

  
});
});