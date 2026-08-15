import { describe, expect, it } from '@jest/globals';
import { ShortUrl } from '../../domain/entities/short-url.entity';
import { OriginalUrl } from '../../domain/value-objects/original-url.value-object';
import { ShortCode } from '../../domain/value-objects/short-code.value-object';
import { InMemoryShortUrlRepository } from './in-memory-short-url.repository';

describe('InMemoryShortUrlRepository', () => {
  it('should save and find a short URL by its short code', async () => {
    const repository = new InMemoryShortUrlRepository();

    const shortCode = ShortCode.create('aB92xK7');

    const shortUrl = ShortUrl.create({
      originalUrl: OriginalUrl.create('https://example.com'),
      shortCode,
      ownerId: 'user-123',
    });

    await repository.save(shortUrl);

    const result = await repository.findByShortCode(shortCode);

    expect(result).toBe(shortUrl);
  });

  it('should return null when the short code does not exist', async () => {
    const repository = new InMemoryShortUrlRepository();

    const result = await repository.findByShortCode(
      ShortCode.create('xY82mN4'),
    );

    expect(result).toBeNull();
  });
});