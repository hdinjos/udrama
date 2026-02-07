import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/core/database/drizzle.service';
import { PasswordService } from 'src/common/security/password/pasword.service';
import { users } from 'src/core/database/schemas';

@Injectable()
export class UserService {
  constructor(
    private readonly drizzleSerive: DrizzleService,
    private readonly passwordService: PasswordService,
  ) {}

  private get db() {
    return this.drizzleSerive.db;
  }

  public findUserByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  public async generateUser() {
    const passHash = await this.passwordService.hash('pass123');
    await this.db.insert(users).values({
      name: 'ngadmin',
      password: passHash,
      email: 'ngadmin@gmail.com',
    });
  }
}
