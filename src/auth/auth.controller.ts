import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() body: LoginDto) {
    const data = await this.authService.signIn(body);

    if (data) return data;
    throw new BadRequestException('email or password invalid');
  }
}
