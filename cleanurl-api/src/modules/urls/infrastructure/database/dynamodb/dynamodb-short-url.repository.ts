import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

import { ShortUrl } from '../../../domain/entities/short-url.entity';
import { ShortUrlRepository } from '../../../domain/repositories/short-url.repository';
import { OriginalUrl } from '../../../domain/value-objects/original-url.value-object';
import { ShortCode } from '../../../domain/value-objects/short-code.value-object';
import { DYNAMODB_DOCUMENT_CLIENT } from './dynamodb.constants';

interface ShortUrlItem {
  PK: string;
  SK: string;
  entityType: 'URL';
  shortCode: string;
  originalUrl: string;
  ownerId: string;
  createdAt: string;
  expiresAt?: string;
  ttl?: number;
}

@Injectable()
export class DynamoDbShortUrlRepository implements ShortUrlRepository {
  private readonly tableName: string;

  constructor(
    @Inject(DYNAMODB_DOCUMENT_CLIENT)
    private readonly documentClient: DynamoDBDocumentClient,
    configService: ConfigService,
  ) {
    this.tableName =
      configService.getOrThrow<string>('DYNAMODB_TABLE_NAME');
  }

  async save(shortUrl: ShortUrl): Promise<void> {
    const item: ShortUrlItem = {
      PK: `URL#${shortUrl.shortCode.value}`,
      SK: 'METADATA',
      entityType: 'URL',
      shortCode: shortUrl.shortCode.value,
      originalUrl: shortUrl.originalUrl.value,
      ownerId: shortUrl.ownerId,
      createdAt: shortUrl.createdAt.toISOString(),
      expiresAt: shortUrl.expiresAt?.toISOString(),
      ttl: shortUrl.expiresAt
        ? Math.floor(shortUrl.expiresAt.getTime() / 1000)
        : undefined,
    };

    await this.documentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      }),
    );
  }

  async findByShortCode(shortCode: ShortCode): Promise<ShortUrl | null> {
    const result = await this.documentClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `URL#${shortCode.value}`,
          SK: 'METADATA',
        },
        ConsistentRead: true,
      }),
    );

    if (!result.Item) {
      return null;
    }

    const item = result.Item as ShortUrlItem;

    return ShortUrl.create({
      originalUrl: OriginalUrl.create(item.originalUrl),
      shortCode: ShortCode.create(item.shortCode),
      ownerId: item.ownerId,
      createdAt: new Date(item.createdAt),
      expiresAt: item.expiresAt
        ? new Date(item.expiresAt)
        : undefined,
    });
  }
}