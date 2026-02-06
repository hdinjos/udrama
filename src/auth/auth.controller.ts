import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/signin.dto';
import { AuthGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() body: LoginDto) {
    const data = await this.authService.signIn(body);

    if (data) return data;
    throw new BadRequestException('email or password invalid');
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return {
      message: 'access profile success',
      data: req.user,
    };
  }
}
