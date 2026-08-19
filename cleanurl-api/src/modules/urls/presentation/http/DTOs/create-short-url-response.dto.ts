export class CreateShortUrlResponseDto {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: Date;
  expiresAt: Date | null;

  constructor(props: CreateShortUrlResponseDto) {
    this.shortCode = props.shortCode;
    this.shortUrl = props.shortUrl;
    this.originalUrl = props.originalUrl;
    this.createdAt = props.createdAt;
    this.expiresAt = props.expiresAt;
  }
}