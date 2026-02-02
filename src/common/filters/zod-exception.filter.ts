import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { formatZodError } from '../errors/zod-error.formater';

@Catch(BadRequestException, ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException | ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Kalau manual parse()
    if (exception instanceof ZodError) {
      return response.status(400).json(formatZodError(exception));
    }

    // Kalau dari ZodValidationPipe
    const res: any = exception.getResponse?.();

    /**
     * Di sinilah rahasianya:
     * nestjs-zod menyimpan issues di res.errors
     */
    if (res?.errors && Array.isArray(res.errors)) {
      return response.status(400).json({
        message: 'Validation Error',
        errors: res.errors.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      });
    }

    // fallback
    return response.status(400).json(res);
  }
}
