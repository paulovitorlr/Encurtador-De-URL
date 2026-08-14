import { OriginalUrl } from '../value-objects/original-url.value-object';
import { ShortCode } from '../value-objects/short-code.value-object';

export interface ShortUrlProps{
    originalUrl: string;
    shortCode: ShortCode;
    ownerId: string;
    createdAt: Date;
    expiresAt?: Date;
}

export class ShortUrl{
    private readonly props: ShortUrlProps;

    constructor(props: ShortUrlProps){
        this.props = props;
    }

    get originalUrl(): string{
        return this.props.originalUrl;
    }

    get shortCode(): ShortCode{
        return this.props.shortCode;
    }

    get ownerId(): string{
        return this.props.ownerId;
    }

    get createdAt(): Date{
        return this.props.createdAt;
    }

    get expiresAt(): Date | undefined{
        return this.props.expiresAt;
    }
}