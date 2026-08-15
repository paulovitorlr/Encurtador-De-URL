import { ShortCode } from '../../domain/value-objects/short-code.value-object';

export interface ShortCodeGenerator {
  generate(): ShortCode;
}