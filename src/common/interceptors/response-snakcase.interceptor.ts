import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { snakeCase } from 'lodash';

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.convertKeysToSnakeCase(data)));
  }

  private convertKeysToSnakeCase(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    // Skip Date
    if (data instanceof Date) {
      return data;
    }

    // Skip primitive
    if (typeof data !== 'object') {
      return data;
    }

    // Handle Array
    if (Array.isArray(data)) {
      return data.map((item) => this.convertKeysToSnakeCase(item));
    }

    // Handle plain object only
    return Object.keys(data).reduce((result, key) => {
      const snakeKey = snakeCase(key);
      result[snakeKey] = this.convertKeysToSnakeCase(data[key]);
      return result;
    }, {} as any);
  }
}
