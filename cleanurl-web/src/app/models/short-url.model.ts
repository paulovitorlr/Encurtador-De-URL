export interface CreateShortUrlRequest {
  originalUrl: string;
}

export interface ShortUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
}
