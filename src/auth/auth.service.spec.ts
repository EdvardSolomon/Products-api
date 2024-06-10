import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password, if validation successful', async () => {
      const mockUser = {
        username: 'test',
        password: 'hashedPassword',
        id: 1,
        email: 'email',
      };
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);
      jest.spyOn(service as any, 'comparePassword').mockReturnValue(true);

      const result = await service.validateUser('test', 'password');
      expect(result).toEqual({ username: 'test', id: 1, email: 'email' });
    });

    it('should return null, if user not found', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      const result = await service.validateUser('test', 'password');
      expect(result).toBeNull();
    });

    it('should return null, if password not compare', async () => {
      const mockUser = {
        username: 'test',
        password: 'hashedPassword',
        id: 1,
        email: 'email',
      };
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);
      jest.spyOn(service as any, 'comparePassword').mockReturnValue(false);

      const result = await service.validateUser('test', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockUser = { username: 'test', id: 1 };
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('register', () => {
    it('should return new user', async () => {
      const registerDto: RegisterDto = {
        username: 'test',
        password: 'password',
        email: 'email',
      };
      const hashedPassword = 'salt:hash';
      const mockUser = {
        id: 1,
        username: 'test',
        password: 'password',
        email: 'email',
      };
      const mockUserWithoutPassword = {
        id: 1,
        username: 'test',
        email: 'email',
      };

      jest
        .spyOn(service as any, 'hashPassword')
        .mockReturnValue(hashedPassword);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await service.register(registerDto);
      expect(result).toEqual(mockUserWithoutPassword);
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
    });
  });

  describe('hashPassword', () => {
    it('should return salted and hashed password', () => {
      const password = '8899string';
      const salt = 'salt';
      const hash = 'hashedString';
      jest
        .spyOn(crypto, 'randomBytes')
        .mockImplementation(() => Buffer.from(salt));
      jest.spyOn(crypto, 'pbkdf2Sync').mockReturnValue(Buffer.from(hash));

      const result = (service as any).hashPassword(password);
      expect(result).toBe(`73616c74:686173686564537472696e67`);
    });
  });

  describe('comparePassword', () => {
    it('should return true, if passwords are compared', () => {
      const password = 'stringg';
      const storedPassword =
        '2b3131fc19a4072bce6b74dcad77f1f3:70b9feab5efbe28f42530db2e4c34d6dfce79ddd6797b8e29a2763348585bd01383e44cae3878a9d7d6c432502ef0bfd8e077bf2fe15728a7eefdabe71eef093';
      const hash =
        '70b9feab5efbe28f42530db2e4c34d6dfce79ddd6797b8e29a2763348585bd01383e44cae3878a9d7d6c432502ef0bfd8e077bf2fe15728a7eefdabe71eef093';
      jest
        .spyOn(crypto, 'pbkdf2Sync')
        .mockReturnValue(Buffer.from(hash, 'hex'));

      const result = (service as any).comparePassword(password, storedPassword);
      expect(result).toBe(true);
    });

    it('should return false, passwords are not compared', () => {
      const password = 'password';
      const storedPassword = 'salt:hashedPassword';
      const hash = 'differentHash';
      jest.spyOn(crypto, 'pbkdf2Sync').mockReturnValue(Buffer.from(hash));

      const result = (service as any).comparePassword(password, storedPassword);
      expect(result).toBe(false);
    });
  });
});
