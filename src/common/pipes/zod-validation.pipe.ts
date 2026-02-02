import { BadRequestException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { formatZodError } from '../errors/zod-error.formater';

export const MyZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new BadRequestException(formatZodError(error));
  },
});
