import { registerAs } from '@nestjs/config';

export const shortUrlConfig = registerAs('shortUrl', () => ({
  baseUrl: process.env.SHORT_URL_BASE_URL,
}));