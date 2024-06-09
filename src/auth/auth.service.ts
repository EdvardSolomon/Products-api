// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { RegisterDto } from './dto';
import config from '../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && this.comparePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDto) {
    const hashedPassword = this.hashPassword(user.password);
    const { password, ...rest } = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
    return rest;
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, `${salt}${config.PEPPER}`, 1000, 64, `sha512`)
      .toString(`hex`);
    return `${salt}:${hash}`;
  }

  private comparePassword(password: string, storedPassword: string): boolean {
    const [salt, hash] = storedPassword.split(':');
    const hashVerify = crypto
      .pbkdf2Sync(password, `${salt}${config.PEPPER}`, 1000, 64, `sha512`)
      .toString(`hex`);
    return hash === hashVerify;
  }
}
