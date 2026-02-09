import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/signin.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() body: LoginDto) {
    const data = await this.authService.signIn(body);

    if (data) return data;
    throw new BadRequestException('email or password invalid');
  }

  @Get('profile')
  profile(@Request() req: Request) {
    return {
      message: 'access profile success',
      data: req['user'],
    };
  }

  @Post('logout')
  async singOut(@Request() req: Request) {
    this.authService.signOut(req);
    return {
      message: 'logout success',
    };
  }
}
