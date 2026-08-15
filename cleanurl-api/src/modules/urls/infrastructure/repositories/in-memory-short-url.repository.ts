import { ShortUrl } from '../../domain/entities/short-url.entity';
import { ShortCode } from '../../domain/value-objects/short-code.value-object';
import { ShortUrlRepository } from '../../domain/repositories/short-url.repository';

export class InMemoryShortUrlRepository implements ShortUrlRepository {
  private readonly shortUrls: ShortUrl[] = [];

  async save(shortUrl: ShortUrl): Promise<void> {
    this.shortUrls.push(shortUrl);
  }

  async findByShortCode(shortCode: ShortCode): Promise<ShortUrl | null> {
    const shortUrl = this.shortUrls.find(
      (item) => item.shortCode.value === shortCode.value,
    );

    return shortUrl ?? null;
  }
}