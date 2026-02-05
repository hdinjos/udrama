import { Module } from '@nestjs/common';
import { PasswordService } from './pasword.service';

@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
