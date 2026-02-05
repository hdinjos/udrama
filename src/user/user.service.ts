import { Injectable } from '@nestjs/common';
import * as schema from '../database/schemas';
import { DrizzleService } from 'src/database/drizzle.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(private readonly drizzleSerive: DrizzleService) {}

  private get db() {
    return this.drizzleSerive.db;
  }

  public findUserByEmail(email: string) {
    this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  }
}
