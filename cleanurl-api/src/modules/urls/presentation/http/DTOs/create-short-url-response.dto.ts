export class CreateShortUrlResponseDto {
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
  expiresAt: Date | null;

  constructor(props: CreateShortUrlResponseDto) {
    this.shortCode = props.shortCode;
    this.originalUrl = props.originalUrl;
    this.createdAt = props.createdAt;
    this.expiresAt = props.expiresAt;
  }
}