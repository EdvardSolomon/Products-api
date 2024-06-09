// src/users/users.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiSuccessResponse,
  ApiUnauthorizedResponse,
} from '../common/decorators';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user data' })
  @ApiSuccessResponse([UserEntity], 'User data')
  @ApiUnauthorizedResponse('Unauthorized')
  @Get('/me')
  async findMe(@Req() { user }): Promise<User | undefined> {
    return this.usersService.findOneById(user.id);
  }
}
