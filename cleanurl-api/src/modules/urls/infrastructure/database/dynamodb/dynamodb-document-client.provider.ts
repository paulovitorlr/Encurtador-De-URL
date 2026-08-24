import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { DYNAMODB_DOCUMENT_CLIENT } from './dynamodb.constants';

export const dynamoDbDocumentClientProvider: Provider = {
  provide: DYNAMODB_DOCUMENT_CLIENT,

  inject: [ConfigService],

  useFactory: (configService: ConfigService): DynamoDBDocumentClient => {
    const region = configService.getOrThrow<string>('AWS_REGION');
    const endpoint = configService.get<string>('DYNAMODB_ENDPOINT');

    const client = new DynamoDBClient({
      region,
      endpoint,
      ...(endpoint
        ? {
            credentials: {
              accessKeyId:
                configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
              secretAccessKey:
                configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
            },
          }
        : {}),
    });

    return DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  },
};