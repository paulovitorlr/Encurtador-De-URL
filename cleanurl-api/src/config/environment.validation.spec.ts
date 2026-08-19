import { describe, expect, it } from '@jest/globals';

import { validateEnvironment } from './environment.validation';

describe('validateEnvironment', () => {
  it('should accept a valid HTTP base URL', () => {
    const result = validateEnvironment({
      SHORT_URL_BASE_URL: 'http://localhost:3000',
    });

    expect(result.SHORT_URL_BASE_URL).toBe('http://localhost:3000');
  });

  it('should accept a valid HTTPS base URL', () => {
    const result = validateEnvironment({
      SHORT_URL_BASE_URL: 'https://cleanurl.com',
    });

    expect(result.SHORT_URL_BASE_URL).toBe('https://cleanurl.com');
  });

  it('should remove trailing slashes from the base URL', () => {
    const result = validateEnvironment({
      SHORT_URL_BASE_URL: 'http://localhost:3000///',
    });

    expect(result.SHORT_URL_BASE_URL).toBe('http://localhost:3000');
  });

  it('should reject a missing base URL', () => {
    expect(() => validateEnvironment({})).toThrow(
      'A variável de ambiente SHORT_URL_BASE_URL é obrigatória.',
    );
  });

  it('should reject an invalid base URL', () => {
    expect(() =>
      validateEnvironment({
        SHORT_URL_BASE_URL: 'endereco-invalido',
      }),
    ).toThrow('A variável SHORT_URL_BASE_URL deve conter uma URL válida.');
  });

  it('should reject protocols other than HTTP and HTTPS', () => {
    expect(() =>
      validateEnvironment({
        SHORT_URL_BASE_URL: 'file:///arquivo',
      }),
    ).toThrow(
      'A variável SHORT_URL_BASE_URL deve utilizar HTTP ou HTTPS.',
    );
  });
});