import { randomInt } from 'node:crypto';
import { ShortCodeGenerator } from '../../application/ports/short-code-generator';
import { ShortCode } from '../../domain/value-objects/short-code.value-object';

export class RandomShortCodeGenerator implements ShortCodeGenerator {
  private static readonly CODE_LENGTH = 7;

  private static readonly BASE62_CHARACTERS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  generate(): ShortCode {
    let generatedCode = '';

    for (let index = 0; index < RandomShortCodeGenerator.CODE_LENGTH; index++) {
      const characterIndex = randomInt(
        0,
        RandomShortCodeGenerator.BASE62_CHARACTERS.length,
      );

      generatedCode +=
        RandomShortCodeGenerator.BASE62_CHARACTERS[characterIndex];
    }

    return ShortCode.create(generatedCode);
  }
}