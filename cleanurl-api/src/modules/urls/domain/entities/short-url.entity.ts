import { OriginalUrl } from '../value-objects/original-url.value-object';
import { ShortCode } from '../value-objects/short-code.value-object';

interface ShortUrlProps {
  originalUrl: OriginalUrl;
  shortCode: ShortCode;
  ownerId: string;
  createdAt: Date;
  expiresAt?: Date;
}

interface CreateShortUrlProps {
  originalUrl: OriginalUrl;
  shortCode: ShortCode;
  ownerId: string;
  createdAt?: Date;
  expiresAt?: Date;
}

export class ShortUrl {
  private constructor(private readonly props: ShortUrlProps) {}

  static create(props: CreateShortUrlProps): ShortUrl {
    const ownerId = props.ownerId.trim();
    const createdAt = props.createdAt ?? new Date();

    if (!ownerId) {
      throw new Error('O proprietário da URL é obrigatório.');
    }

    if (props.expiresAt && props.expiresAt <= createdAt) {
      throw new Error(
        'A data de expiração deve ser posterior à data de criação.',
      );
    }

    return new ShortUrl({
      originalUrl: props.originalUrl,
      shortCode: props.shortCode,
      ownerId,
      createdAt,
      expiresAt: props.expiresAt,
    });
  }

  isExpired(referenceDate: Date = new Date()): boolean {
    if (!this.props.expiresAt) {
      return false;
    }

    return referenceDate >= this.props.expiresAt;
  }

  get originalUrl(): OriginalUrl {
    return this.props.originalUrl;
  }

  get shortCode(): ShortCode {
    return this.props.shortCode;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }
}