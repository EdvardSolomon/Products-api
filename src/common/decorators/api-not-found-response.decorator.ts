import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiNotFoundResponse(description = 'Not found') {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description,
    }),
  );
}
