import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PasswordModule } from 'src/common/security/password/password.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PasswordModule,
    JwtModule.register({
      global: true,
      secret: 'ke13erfke2frfl3r23fg20r33',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
