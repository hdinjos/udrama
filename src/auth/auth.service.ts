import { Injectable, Request } from '@nestjs/common';
import { PasswordService } from 'src/common/security/password/pasword.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/signin.dto';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signIn({ email, password }: LoginDto) {
    const user = await this.userService.findUserByEmail(email);
    if (user?.password) {
      const verifiedPassword = await this.passwordService.verify(
        user.password,
        password,
      );
      if (verifiedPassword) {
        const token = await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
        });

        return {
          access_token: token,
        };
      }
    }
    return false;
  }

  async signOut(req: Request) {
    const toExp = this.getReaminingExpired(req);
    const [_, token] = req['headers']['authorization'].split(' ') ?? [];

    await this.redisService.set('blacklist:${token}', token, toExp);
  }

  getReaminingExpired(req: Request): number {
    const exp: number = req['user']['exp'] || 1;
    const now: number = Math.floor(Date.now() / 1000);
    const result = exp - now;

    return result;
  }
}
