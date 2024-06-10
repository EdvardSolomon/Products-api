import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { UserEntity } from '../users/entities/user.entity';
import { BadRequestException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const req = { user: { id: 1, username: 'testuser' } };
      const access_token = 'jwt-token';
      jest.spyOn(authService, 'login').mockResolvedValue({ access_token });

      const result = await controller.login(req);

      expect(result).toEqual({ access_token });
      expect(authService.login).toHaveBeenCalledWith(req.user);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const req = { user: { id: 1, username: 'testuser' } };
      const error = new BadRequestException('Unauthorized');
      jest.spyOn(authService, 'login').mockRejectedValue(error);

      await expect(controller.login(req)).rejects.toThrow(BadRequestException);
      await expect(controller.login(req)).rejects.toThrow('Unauthorized');
    });
  });

  describe('register', () => {
    it('should return user data on successful registration', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        password: 'password123',
        email: 'email123',
      };
      const userEntity: UserEntity = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        email: 'email123',
      };
      jest.spyOn(authService, 'register').mockResolvedValue(userEntity);

      const result = await controller.register(registerDto);

      expect(result).toEqual(userEntity);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw BadRequestException if registration fails', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        password: 'password123',
        email: 'email',
      };
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new BadRequestException('Bad Request'));

      try {
        await controller.register(registerDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Bad Request');
      }
    });
  });
});
