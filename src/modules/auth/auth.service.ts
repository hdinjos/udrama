import { Injectable, Request, ConflictException } from '@nestjs/common';
import { PasswordService } from 'src/common/security/password/pasword.service';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/signin.dto';
import { RedisService } from 'src/core/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { DrizzleService } from 'src/core/database/drizzle.service';
import { users } from 'src/core/database/schemas';
import { GoogleAuthService } from 'src/common/auth/google-auth/google-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly drizzleService: DrizzleService,
    private readonly googleAuthService: GoogleAuthService,
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
          role_id: user.role?.id,
          role_name: user.role?.name,
        });

        return {
          access_token: token,
        };
      }
    }
    return false;
  }

  async register({ name, email, password }: RegisterDto) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.passwordService.hash(password);
    const [newUser] = await this.drizzleService.db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        roleId: 2,
      })
      .returning({ id: users.id, name: users.name, email: users.email });

    const token = await this.jwtService.signAsync({
      sub: newUser.id,
      email: newUser.email,
      role_id: 2,
      role_name: 'user',
    });

    return {
      access_token: token,
    };
  }

  async googleSignIn({ credential }: { credential: string }) {
    const googlePayload =
      await this.googleAuthService.verifyIdToken(credential);

    const existingUser = await this.userService.findUserByEmail(
      googlePayload.email,
    );
    if (existingUser) {
      const token = await this.jwtService.signAsync({
        sub: existingUser.id,
        email: existingUser.email,
        role_id: existingUser.role?.id,
        role_name: existingUser.role?.name,
      });

      return {
        access_token: token,
      };
    }

    const [newUser] = await this.drizzleService.db
      .insert(users)
      .values({
        name: googlePayload.name,
        email: googlePayload.email,
        password: null,
        roleId: 2,
      })
      .returning({ id: users.id, name: users.name, email: users.email });

    const token = await this.jwtService.signAsync({
      sub: newUser.id,
      email: newUser.email,
      role_id: 2,
      role_name: 'user',
    });

    return {
      access_token: token,
    };
  }

  async signOut(req: Request) {
    const toExp = this.getReaminingExpired(req);
    const [_, token] = req['headers']['authorization'].split(' ') ?? [];

    await this.redisService.set(`blacklist:${token}`, token, toExp);
  }

  getReaminingExpired(req: Request): number {
    const exp: number = req['user']['exp'] || 1;
    const now: number = Math.floor(Date.now() / 1000);
    const result = exp - now;

    return result;
  }
}
