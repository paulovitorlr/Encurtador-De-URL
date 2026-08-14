export class ShortCode {
  private static readonly CODE_LENGTH = 7;
  private static readonly BASE62_PATTERN = /^[a-zA-Z0-9]+$/;

  private constructor(private readonly internalValue: string) {}

  static create(value: string): ShortCode {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      throw new Error('O código curto é obrigatório.');
    }

    if (normalizedValue.length !== this.CODE_LENGTH) {
      throw new Error(
        `O código curto deve possuir ${this.CODE_LENGTH} caracteres.`,
      );
    }

    if (!this.BASE62_PATTERN.test(normalizedValue)) {
      throw new Error(
        'O código curto deve conter somente letras e números.',
      );
    }

    return new ShortCode(normalizedValue);
  }

  get value(): string {
    return this.internalValue;
  }
}