import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PasswordModule } from 'src/common/security/password/password.module';
import { UserController } from './user.controller';

@Module({
  imports: [PasswordModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
