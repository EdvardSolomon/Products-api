// src/common/decorators/api-success-response.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiSuccessResponse(
  type: any,
  description = 'Successful response',
) {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description,
      type,
    }),
  );
}
