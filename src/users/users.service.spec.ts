import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUsername', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'testuser' } as User;
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      expect(await service.findOneByUsername('testuser')).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOneByUsername('unknownuser')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'testuser' } as User;
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      expect(await service.findOneById(1)).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOneById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const user = {
        username: 'newuser',
        email: 'newuser@example.com',
      } as User;
      const createdUser = { id: 1, ...user } as User;
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      expect(await service.create(user)).toEqual(createdUser);
    });

    it('should throw ConflictException if username already exists', async () => {
      const user = {
        username: 'existinguser',
        email: 'existinguser@example.com',
      } as User;
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      await expect(service.create(user)).rejects.toThrow(ConflictException);
    });
  });
});
