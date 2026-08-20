import { describe, expect, it } from '@jest/globals';
import { ShortUrl } from './short-url.entity';
import { OriginalUrl } from '../value-objects/original-url.value-object';
import { ShortCode } from '../value-objects/short-code.value-object';

describe('ShortUrl', () => {
  const originalUrl = OriginalUrl.create('https://example.com');
  const shortCode = ShortCode.create('aB92xK7');

  it('should create a short URL', () => {
    const createdAt = new Date('2026-08-14T10:00:00Z');

    const shortUrl = ShortUrl.create({
      originalUrl,
      shortCode,
      ownerId: 'user-123',
      createdAt,
    });

    expect(shortUrl.originalUrl).toBe(originalUrl);
    expect(shortUrl.shortCode).toBe(shortCode);
    expect(shortUrl.ownerId).toBe('user-123');
    expect(shortUrl.createdAt).toEqual(createdAt);
    expect(shortUrl.expiresAt).toBeUndefined();
  });

  it('should automatically define the creation date', () => {
    const beforeCreation = new Date();

    const shortUrl = ShortUrl.create({
      originalUrl,
      shortCode,
      ownerId: 'user-123',
    });

    const afterCreation = new Date();

    expect(shortUrl.createdAt.getTime()).toBeGreaterThanOrEqual(
      beforeCreation.getTime(),
    );

    expect(shortUrl.createdAt.getTime()).toBeLessThanOrEqual(
      afterCreation.getTime(),
    );
  });

  it('should not create a short URL without an owner', () => {
    expect(() =>
      ShortUrl.create({
        originalUrl,
        shortCode,
        ownerId: '   ',
      }),
    ).toThrow('O proprietário da URL é obrigatório.');
  });

  it('should not accept an expiration date before the creation date', () => {
    expect(() =>
      ShortUrl.create({
        originalUrl,
        shortCode,
        ownerId: 'user-123',
        createdAt: new Date('2026-08-14T10:00:00Z'),
        expiresAt: new Date('2026-08-13T10:00:00Z'),
      }),
    ).toThrow(
      'A data de expiração deve ser posterior à data de criação.',
    );
  });

  it('should not be expired when there is no expiration date', () => {
    const shortUrl = ShortUrl.create({
      originalUrl,
      shortCode,
      ownerId: 'user-123',
      createdAt: new Date('2026-08-14T10:00:00Z'),
    });

    expect(
      shortUrl.isExpired(new Date('2030-01-01T00:00:00Z')),
    ).toBe(false);
  });

  it('should not be expired before its expiration date', () => {
    const shortUrl = ShortUrl.create({
      originalUrl,
      shortCode,
      ownerId: 'user-123',
      createdAt: new Date('2026-08-14T10:00:00Z'),
      expiresAt: new Date('2026-08-20T10:00:00Z'),
    });

    expect(
      shortUrl.isExpired(new Date('2026-08-19T10:00:00Z')),
    ).toBe(false);
  });

  it('should be expired when its expiration date is reached', () => {
    const expirationDate = new Date('2026-08-20T10:00:00Z');

    const shortUrl = ShortUrl.create({
      originalUrl,
      shortCode,
      ownerId: 'user-123',
      createdAt: new Date('2026-08-14T10:00:00Z'),
      expiresAt: expirationDate,
    });

    expect(shortUrl.isExpired(expirationDate)).toBe(true);
  });

  it('should identify an expired short URL', () => {
  const shortUrl = ShortUrl.create({
    originalUrl,
    shortCode,
    ownerId: 'user-123',
    createdAt: new Date('2026-08-20T10:00:00.000Z'),
    expiresAt: new Date('2026-08-20T11:00:00.000Z'),
  });

  const isExpired = shortUrl.isExpired(
    new Date('2026-08-20T12:00:00.000Z'),
  );

  expect(isExpired).toBe(true);
});

it('should identify a short URL that has not expired', () => {
  const shortUrl = ShortUrl.create({
    originalUrl,
    shortCode,
    ownerId: 'user-123',
    createdAt: new Date('2026-08-20T10:00:00.000Z'),
    expiresAt: new Date('2026-08-20T13:00:00.000Z'),
  });

  const isExpired = shortUrl.isExpired(
    new Date('2026-08-20T12:00:00.000Z'),
  );

  expect(isExpired).toBe(false);
  });

  it('should identify a short URL without expiration as active', () => {
  const shortUrl = ShortUrl.create({
    originalUrl,
    shortCode,
    ownerId: 'user-123',
  });

  expect(shortUrl.isExpired(new Date())).toBe(false);
  });
});