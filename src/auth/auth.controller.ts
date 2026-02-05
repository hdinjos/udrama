import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDramaDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() body: loginDramaDto) {
    const data = await this.authService.signIn(body.email, body.password);

    if (data) return data;
    throw new BadRequestException('Email atau Password Not Valid');
  }
}
