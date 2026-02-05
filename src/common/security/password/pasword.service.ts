import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class PasswordService {
  async hash(plain: string): Promise<string> {
    return await argon.hash(plain);
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    return await argon.verify(hash, plain);
  }
}
