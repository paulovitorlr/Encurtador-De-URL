import { describe, expect, it } from '@jest/globals';
import { RandomShortCodeGenerator } from './random-short-code.generator';

describe('RandomShortCodeGenerator', () => {
  it('should generate a valid Base62 short code with 7 characters', () => {
    const generator = new RandomShortCodeGenerator();

    const shortCode = generator.generate();

    expect(shortCode.value).toHaveLength(7);
    expect(shortCode.value).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it('should generate different codes', () => {
    const generator = new RandomShortCodeGenerator();

    const firstShortCode = generator.generate();
    const secondShortCode = generator.generate();

    expect(firstShortCode.value).not.toBe(secondShortCode.value);
  });
});