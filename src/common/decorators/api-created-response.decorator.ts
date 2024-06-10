import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiCreatedResponse(
  type: any,
  description = 'Successful response',
) {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description,
      type,
    }),
  );
}
