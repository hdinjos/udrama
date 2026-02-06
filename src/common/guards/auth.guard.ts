import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.getToken(request);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }

    const tokenVerified = await this.jwtService.verifyAsync(token);
    if (tokenVerified) {
      console.log(tokenVerified);
      request['user'] = tokenVerified;
      return true;
    }

    return false;
  }

  private getToken(req): string {
    const headers = req['headers'];
    const [type, token] = headers['authorization']?.split(' ') ?? [];
    return type !== 'Bearer' ? '' : token;
  }
}
