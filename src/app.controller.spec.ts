import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppController } from './app.controller';
import { INestApplication } from '@nestjs/common';

describe('AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /health', async () => {
    await request(app.getHttpServer()).get('/health').expect(200);
  });
});
