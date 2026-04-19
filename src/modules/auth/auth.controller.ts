import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleSignInDto } from './dto/google-signin.dto';
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

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Public()
  @Post('google')
  async googleSignIn(@Body() body: GoogleSignInDto) {
    try {
      return await this.authService.googleSignIn(body);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException('Google sign-in failed');
    }
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
