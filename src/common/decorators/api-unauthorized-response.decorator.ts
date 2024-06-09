import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiUnauthorizedResponse(description = 'Unauthorized') {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description,
    }),
  );
}
