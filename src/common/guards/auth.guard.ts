import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import {
  JwtService,
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from '@nestjs/jwt';

import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.getToken(request);
    if (!token) throw new UnauthorizedException();

    const blacklistToken = await this.redisService.get('blacklist:${token}');
    if (blacklistToken === token) throw new UnauthorizedException();

    try {
      const tokenVerified = await this.jwtService.verifyAsync(token);
      if (tokenVerified) {
        request['user'] = tokenVerified;
        return true;
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('token expired');
      } else if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('token not valid');
      } else if (err instanceof NotBeforeError) {
        throw new UnauthorizedException('token not active yet');
      }

      throw new UnauthorizedException();
    }

    return false;
  }

  private getToken(req): string {
    const headers = req['headers'];
    const [type, token] = headers['authorization']?.split(' ') ?? [];
    return type !== 'Bearer' ? '' : token;
  }
}
