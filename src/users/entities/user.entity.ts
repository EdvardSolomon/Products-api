import { User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class UserEntity implements User {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  email: string;
}
