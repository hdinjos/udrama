import { Injectable } from '@nestjs/common';
import { PasswordService } from 'src/common/security/password/pasword.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
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
}
