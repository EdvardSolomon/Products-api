import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '@prisma/client';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersController', () => {
  let app: INestApplication;
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findOneById: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      if (authHeader === 'Bearer valid-token') {
        req.user = { id: 1 };
        return true;
      } else {
        return false;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMe', () => {
    it('should return user data with valid token', async () => {
      const user = { id: 1, username: 'testuser' } as User;
      mockUsersService.findOneById.mockResolvedValue(user);

      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(200)
        .expect(user);
    });

    it(`GET /users/me with invalid token`, async () => {
      const canActivate = () => {
        throw new UnauthorizedException();
      };

      const moduleRef = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [PrismaService, UsersService],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate })
        .compile();

      app = moduleRef.createNestApplication();
      await app.init();

      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer invalidtoken`)
        .expect(401)
        .expect({
          message: 'Unauthorized',
          statusCode: 401,
        });
    });
  });
});
