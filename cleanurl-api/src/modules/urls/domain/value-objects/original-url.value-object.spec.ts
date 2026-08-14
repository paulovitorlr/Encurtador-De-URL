import { describe, expect, it } from '@jest/globals';
import { OriginalUrl } from './original-url.value-object';

describe('OriginalUrl', () => {
  it('should create an original URL with a valid HTTP address', () => {
    const originalUrl = OriginalUrl.create('http://example.com');

    expect(originalUrl.value).toBe('http://example.com');
  });

  it('should create an original URL with a valid HTTPS address', () => {
    const originalUrl = OriginalUrl.create('https://example.com/product/123');

    expect(originalUrl.value).toBe(
      'https://example.com/product/123',
    );
  });

  it('should remove spaces around the URL', () => {
    const originalUrl = OriginalUrl.create(
      '  https://example.com  ',
    );

    expect(originalUrl.value).toBe('https://example.com');
  });

  it('should not create an original URL with an empty value', () => {
    expect(() => OriginalUrl.create('')).toThrow(
      'A URL original é obrigatória.',
    );
  });

  it('should not create an original URL containing only spaces', () => {
    expect(() => OriginalUrl.create('   ')).toThrow(
      'A URL original é obrigatória.',
    );
  });

  it('should not create an invalid original URL', () => {
    expect(() => OriginalUrl.create('invalid-url')).toThrow(
      'A URL original é inválida.',
    );
  });

  it('should not accept the JavaScript protocol', () => {
    expect(() =>
      OriginalUrl.create('javascript:alert("attack")'),
    ).toThrow(
      'A URL deve utilizar o protocolo HTTP ou HTTPS.',
    );
  });

  it('should not accept the file protocol', () => {
    expect(() =>
      OriginalUrl.create('file:///users/document.txt'),
    ).toThrow(
      'A URL deve utilizar o protocolo HTTP ou HTTPS.',
    );
  });
});