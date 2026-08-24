import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

import { ShortUrl } from '../../src/modules/urls/domain/entities/short-url.entity';
import { OriginalUrl } from '../../src/modules/urls/domain/value-objects/original-url.value-object';
import { ShortCode } from '../../src/modules/urls/domain/value-objects/short-code.value-object';
import { DynamoDbShortUrlRepository } from '../../src/modules/urls/infrastructure/database/dynamodb/dynamodb-short-url.repository';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  afterAll,
  beforeAll
} from '@jest/globals';

describe('DynamoDbShortUrlRepository (integration)', () => {
  const tableName = 'CleanUrlIntegrationTests';

  let dynamoDbClient: DynamoDBClient;
  let documentClient: DynamoDBDocumentClient;
  let repository: DynamoDbShortUrlRepository;

  beforeAll(async () => {
    dynamoDbClient = new DynamoDBClient({
      region: 'local',
      endpoint: 'http://localhost:8000',
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local',
      },
    });

    documentClient = DynamoDBDocumentClient.from(dynamoDbClient);

    await dynamoDbClient.send(
      new CreateTableCommand({
        TableName: tableName,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          {
            AttributeName: 'PK',
            AttributeType: 'S',
          },
          {
            AttributeName: 'SK',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'PK',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'SK',
            KeyType: 'RANGE',
          },
        ],
      }),
    );

    await waitUntilTableExists(
      {
        client: dynamoDbClient,
        maxWaitTime: 30,
      },
      {
        TableName: tableName,
      },
    );

    const configService = new ConfigService({
      DYNAMODB_TABLE_NAME: tableName,
    });

    repository = new DynamoDbShortUrlRepository(
      documentClient,
      configService,
    );
  });

  afterAll(async () => {
    await dynamoDbClient.send(
      new DeleteTableCommand({
        TableName: tableName,
      }),
    );

    documentClient.destroy();
    dynamoDbClient.destroy();
  });

  it('deve salvar e encontrar uma URL encurtada', async () => {
    const createdAt = new Date('2026-08-24T12:00:00.000Z');
    const expiresAt = new Date('2026-09-23T12:00:00.000Z');

    const shortUrl = ShortUrl.create({
      originalUrl: OriginalUrl.create(
        'https://example.com/produtos/123',
      ),
      shortCode: ShortCode.create('aB3dE7x'),
      ownerId: 'integration-test-user',
      createdAt,
      expiresAt,
    });

    await repository.save(shortUrl);

    const result = await repository.findByShortCode(
      ShortCode.create('aB3dE7x'),
    );

    expect(result).not.toBeNull();
    expect(result?.shortCode.value).toBe('aB3dE7x');
    expect(result?.originalUrl.value).toBe(
      'https://example.com/produtos/123',
    );
    expect(result?.ownerId).toBe('integration-test-user');
    expect(result?.createdAt).toEqual(createdAt);
    expect(result?.expiresAt).toEqual(expiresAt);
  });

  it('deve salvar expiresAt também como TTL em segundos', async () => {
    const expiresAt = new Date('2026-09-23T12:00:00.000Z');

    const shortUrl = ShortUrl.create({
      originalUrl: OriginalUrl.create('https://example.com/ttl'),
      shortCode: ShortCode.create('TtL1234'),
      ownerId: 'integration-test-user',
      createdAt: new Date('2026-08-24T12:00:00.000Z'),
      expiresAt,
    });

    await repository.save(shortUrl);

    const response = await documentClient.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          PK: 'URL#TtL1234',
          SK: 'METADATA',
        },
        ConsistentRead: true,
      }),
    );

    expect(response.Item?.ttl).toBe(
      Math.floor(expiresAt.getTime() / 1000),
    );
  });

  it('deve retornar null quando o código não existir', async () => {
    const result = await repository.findByShortCode(
      ShortCode.create('XyZ9876'),
    );

    expect(result).toBeNull();
  });
});