import { describe, expect, it } from '@jest/globals';
import { ShortCode } from './short-code.value-object';

describe('ShortCode', () => {
  it('should create a valid short code', () => {
    const shortCode = ShortCode.create('aB92xK7');

    expect(shortCode.value).toBe('aB92xK7');
  });

  it('should accept a code containing only lowercase letters', () => {
    const shortCode = ShortCode.create('abcdefg');

    expect(shortCode.value).toBe('abcdefg');
  });

  it('should accept a code containing only uppercase letters', () => {
    const shortCode = ShortCode.create('ABCDEFG');

    expect(shortCode.value).toBe('ABCDEFG');
  });

  it('should accept a code containing only numbers', () => {
    const shortCode = ShortCode.create('1234567');

    expect(shortCode.value).toBe('1234567');
  });

  it('should remove spaces around the code', () => {
    const shortCode = ShortCode.create('  aB92xK7  ');

    expect(shortCode.value).toBe('aB92xK7');
  });

  it('should not create an empty short code', () => {
    expect(() => ShortCode.create('')).toThrow(
      'O código curto é obrigatório.',
    );
  });

  it('should not create a short code containing only spaces', () => {
    expect(() => ShortCode.create('   ')).toThrow(
      'O código curto é obrigatório.',
    );
  });

  it('should not create a short code shorter than seven characters', () => {
    expect(() => ShortCode.create('aB92xK')).toThrow(
      'O código curto deve possuir 7 caracteres.',
    );
  });

  it('should not create a short code longer than seven characters', () => {
    expect(() => ShortCode.create('aB92xK78')).toThrow(
      'O código curto deve possuir 7 caracteres.',
    );
  });

  it('should not accept special characters', () => {
    expect(() => ShortCode.create('aB92-K7')).toThrow(
      'O código curto deve conter somente letras e números.',
    );
  });

  it('should not accept script content', () => {
    expect(() => ShortCode.create('<script>')).toThrow();
  });
});