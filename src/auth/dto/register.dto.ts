import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class RegisterDto extends OmitType(UserEntity, ['id']) {}
