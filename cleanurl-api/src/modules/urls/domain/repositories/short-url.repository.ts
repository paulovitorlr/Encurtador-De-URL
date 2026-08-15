import { ShortUrl } from "../entities/short-url.entity";
import { ShortCode } from "../value-objects/short-code.value-object";

export interface ShortUrlRepository {
    save(shortUrl : ShortUrl): Promise<void>;

    findByShortCode(shortCode: ShortCode): Promise<ShortUrl | null>;
}