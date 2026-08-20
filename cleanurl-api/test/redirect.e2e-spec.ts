import { INestApplication } from '@nestjs/common';
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

import { ShortUrlNotFoundError } from '../src/modules/urls/domain/errors/short-url-not-found.error';
import { ResolveShortUrlUseCase } from '../src/modules/urls/application/use-cases/resolve-short-url.use-case';
import { RedirectController } from '../src/modules/urls/presentation/http/controllers/redirect.controller';
import { InvalidShortCodeError } from '../src/modules/urls/domain/errors/invalid-short-code.error'
import { ShortUrlExpiredError } from '../src/modules/urls/domain/errors/short-url-expired.error';

describe('RedirectController (e2e)', () => {
  let app: INestApplication;

  const resolveShortUrlUseCaseMock = {
    execute: jest.fn<ResolveShortUrlUseCase['execute']>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: ResolveShortUrlUseCase,
          useValue: resolveShortUrlUseCaseMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('deve redirecionar para a URL original com status 302', async () => {
    resolveShortUrlUseCaseMock.execute.mockResolvedValue({
      originalUrl: 'https://example.com/produtos/123',
    });

    const response = await request(app.getHttpServer())
      .get('/aB3dE7x')
      .expect(302);

    expect(response.headers.location).toBe(
      'https://example.com/produtos/123',
    );

    expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledWith({
      shortCode: 'aB3dE7x',
    });

    expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 404 quando a URL curta não for encontrada', async () => {
  resolveShortUrlUseCaseMock.execute.mockRejectedValue(
    new ShortUrlNotFoundError(),
  );

  const response = await request(app.getHttpServer())
    .get('/aB3dE7x')
    .expect(404);

  expect(response.body).toEqual({
    message: 'URL curta não encontrada.',
    error: 'Not Found',
    statusCode: 404,
  });

  expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledWith({
    shortCode: 'aB3dE7x',
  });

  expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledTimes(1);
});

it('deve retornar 400 quando o código curto for inválido', async () => {
  resolveShortUrlUseCaseMock.execute.mockRejectedValue(
    new InvalidShortCodeError(
      'O código curto deve possuir 7 caracteres.',
    ),
  );

  const response = await request(app.getHttpServer())
    .get('/abc')
    .expect(400);

  expect(response.body).toEqual({
    message: 'O código curto deve possuir 7 caracteres.',
    error: 'Bad Request',
    statusCode: 400,
  });

  expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledWith({
    shortCode: 'abc',
  });

  expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledTimes(1);
});

it('deve retornar 500 quando ocorrer um erro inesperado', async () => {
  resolveShortUrlUseCaseMock.execute.mockRejectedValue(
    new Error('Falha inesperada'),
  );

  const response = await request(app.getHttpServer())
    .get('/aB3dE7x')
    .expect(500);

  expect(response.body).toEqual({
    statusCode: 500,
    message: 'Internal server error',
  });

  expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledWith({
    shortCode: 'aB3dE7x',
  });

  expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledTimes(1);
});

it('deve retornar 410 quando a URL curta estiver expirada', async () => {
  resolveShortUrlUseCaseMock.execute.mockRejectedValue(
    new ShortUrlExpiredError(),
  );

  const response = await request(app.getHttpServer())
    .get('/aB3dE7x')
    .expect(410);

  expect(response.body).toEqual({
    message: 'A URL curta está expirada.',
    error: 'Gone',
    statusCode: 410,
  });

  expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledWith({
    shortCode: 'aB3dE7x',
  });

  expect(resolveShortUrlUseCaseMock.execute).toHaveBeenCalledTimes(1);
});
});