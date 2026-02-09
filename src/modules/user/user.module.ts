import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PasswordModule } from 'src/common/security/password/password.module';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PasswordModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
