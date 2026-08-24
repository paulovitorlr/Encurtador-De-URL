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
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';
import request from 'supertest';



describe('Fluxo completo da URL encurtada (integration)', () => {
  const tableName = 'CleanUrlFlowIntegrationTests';
  const originalUrl = 'https://example.com/produtos/123';

  let app: INestApplication;
  let dynamoDbClient: DynamoDBClient;
  let documentClient: DynamoDBDocumentClient;

  beforeAll(async () => {
  process.env.SHORT_URL_BASE_URL = 'http://localhost:3000';
  process.env.AWS_REGION = 'local';
  process.env.AWS_ACCESS_KEY_ID = 'local';
  process.env.AWS_SECRET_ACCESS_KEY = 'local';
  process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';
  process.env.DYNAMODB_TABLE_NAME = tableName;

  const { AppModule } =
  require('../../src/app.module') as typeof import('../../src/app.module');

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

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

 afterAll(async () => {
  if (app) {
    await app.close();
  }

  if (dynamoDbClient) {
    await dynamoDbClient.send(
      new DeleteTableCommand({
        TableName: tableName,
      }),
    );
  }

  documentClient?.destroy();
  dynamoDbClient?.destroy();
});

  it('deve criar, persistir e redirecionar uma URL encurtada', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/urls')
      .send({
        originalUrl,
      })
      .expect(201);

    const shortCode: string = createResponse.body.shortCode;

    expect(shortCode).toBeDefined();
    expect(createResponse.body.originalUrl).toBe(originalUrl);
    expect(createResponse.body.shortUrl).toBe(
      `http://localhost:3000/${shortCode}`,
    );

    const persistedItem = await documentClient.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          PK: `URL#${shortCode}`,
          SK: 'METADATA',
        },
        ConsistentRead: true,
      }),
    );

    expect(persistedItem.Item).toBeDefined();
    expect(persistedItem.Item?.shortCode).toBe(shortCode);
    expect(persistedItem.Item?.originalUrl).toBe(originalUrl);

    const redirectResponse = await request(app.getHttpServer())
      .get(`/${shortCode}`)
      .expect(302);

    expect(redirectResponse.headers.location).toBe(originalUrl);
  });
});