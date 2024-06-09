import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

export class LoginDto extends PickType(RegisterDto, ['password']) {
  @IsString()
  username: string;
}
