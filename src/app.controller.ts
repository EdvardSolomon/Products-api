import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({ summary: 'Health check' })
  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth(): void {}
}
