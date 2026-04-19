import {
  BadRequestException,
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { formatZodError } from '../errors/zod-error.formater';

const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new BadRequestException(formatZodError(error));
  },
});

@Injectable()
export class MyZodValidationPipe implements PipeTransform {
  private readonly innerPipe = new ZodValidationPipe();

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    return this.innerPipe.transform(value, metadata);
  }
}
