import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import request from 'supertest';


import { InvalidOriginalUrlError } from '../src/modules/urls/domain/errors/invalid-original-url.error';
import { CreateShortUrlUseCase } from '../src/modules/urls/application/use-cases/create-short-url.use-case';
import { UrlsController } from '../src/modules/urls/presentation/http/controllers/urls.controller';

describe('UrlsController (e2e)', () => {
  let app: INestApplication;

  const createShortUrlUseCaseMock = {
    execute: jest.fn<CreateShortUrlUseCase['execute']>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: CreateShortUrlUseCase,
          useValue: createShortUrlUseCaseMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('deve criar uma URL encurtada e retornar 201', async () => {
    const createdAt = new Date('2026-08-18T12:00:00.000Z');

    createShortUrlUseCaseMock.execute.mockResolvedValue({
      shortCode: 'aB3dE7x',
      originalUrl: 'https://example.com/produtos/123',
      ownerId: 'temporary-user-id',
      createdAt,
      expiresAt: undefined,
    });

    const response = await request(app.getHttpServer())
      .post('/api/v1/urls')
      .send({
        originalUrl: 'https://example.com/produtos/123',
      })
      .expect(201);

    expect(response.body).toEqual({
      shortCode: 'aB3dE7x',
      originalUrl: 'https://example.com/produtos/123',
      createdAt: createdAt.toISOString(),
      expiresAt: null,
    });

    expect(createShortUrlUseCaseMock.execute).toHaveBeenCalledWith({
      originalUrl: 'https://example.com/produtos/123',
      ownerId: 'temporary-user-id',
    });

    expect(createShortUrlUseCaseMock.execute).toHaveBeenCalledTimes(1);
  });
  it('deve retornar 400 quando a URL original não for enviada', async () => {
  const response = await request(app.getHttpServer())
    .post('/api/v1/urls')
    .send({})
    .expect(400);

  expect(response.body).toEqual({
    message: ['A URL original é obrigatória.', 'A URL original deve ser uma string.'],
    error: 'Bad Request',
    statusCode: 400,
  });

  expect(createShortUrlUseCaseMock.execute).not.toHaveBeenCalled();
  });
  it('deve retornar 400 quando a URL original não for uma string', async () => {
  const response = await request(app.getHttpServer())
    .post('/api/v1/urls')
    .send({
      originalUrl: 123,
    })
    .expect(400);

  expect(response.body).toEqual({
    message: ['A URL original deve ser uma string.'],
    error: 'Bad Request',
    statusCode: 400,
  });

  expect(createShortUrlUseCaseMock.execute).not.toHaveBeenCalled();
  });
  it('deve retornar 400 quando o cliente enviar ownerId', async () => {
  const response = await request(app.getHttpServer())
    .post('/api/v1/urls')
    .send({
      originalUrl: 'https://example.com',
      ownerId: 'user-fraudulento',
    })
    .expect(400);

  expect(response.body).toEqual({
    message: ['property ownerId should not exist'],
    error: 'Bad Request',
    statusCode: 400,
  });

  expect(createShortUrlUseCaseMock.execute).not.toHaveBeenCalled();
  });
  it('deve retornar 400 quando o domínio rejeitar a URL original', async () => {
  createShortUrlUseCaseMock.execute.mockRejectedValue(
    new InvalidOriginalUrlError('A URL original é inválida.'),
  );

  const response = await request(app.getHttpServer())
    .post('/api/v1/urls')
    .send({
      originalUrl: 'url-invalida',
    })
    .expect(400);

  expect(response.body).toEqual({
    message: 'A URL original é inválida.',
    error: 'Bad Request',
    statusCode: 400,
  });

  expect(createShortUrlUseCaseMock.execute).toHaveBeenCalledWith({
    originalUrl: 'url-invalida',
    ownerId: 'temporary-user-id',
  });

  expect(createShortUrlUseCaseMock.execute).toHaveBeenCalledTimes(1);
  });
  it('deve retornar 500 quando ocorrer um erro inesperado', async () => {
  createShortUrlUseCaseMock.execute.mockRejectedValue(
    new Error('Falha inesperada'),
  );

  const response = await request(app.getHttpServer())
    .post('/api/v1/urls')
    .send({
      originalUrl: 'https://example.com',
    })
    .expect(500);

  expect(response.body).toEqual({
    statusCode: 500,
    message: 'Internal server error',
  });

  expect(createShortUrlUseCaseMock.execute).toHaveBeenCalledTimes(1);
  });
});