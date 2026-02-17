import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { SKIP_RESPONSE_KEY } from 'src/common/decorators/skip-response.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipResponse = this.reflector.getAllAndOverride(SKIP_RESPONSE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipResponse) return next.handle();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
