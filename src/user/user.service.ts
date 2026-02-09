import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/core/database/drizzle.service';
import { PasswordService } from 'src/common/security/password/pasword.service';
import { users, roles } from 'src/core/database/schemas';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly drizzleSerive: DrizzleService,
    private readonly passwordService: PasswordService,
  ) {}

  private get db() {
    return this.drizzleSerive.db;
  }

  private async defaultPasswordHash() {
    return await this.passwordService.hash('pass123');
  }

  public findUserByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      with: {
        role: true,
      },
    });
  }

  public async generateUser() {
    const passHash = await this.defaultPasswordHash();
    await this.db.insert(users).values({
      name: 'ngadmin',
      password: passHash,
      email: 'ngadmin@gmail.com',
    });
  }

  public async generateRole() {
    const roleNames = [
      {
        name: 'admin',
      },
      {
        name: 'user',
      },
    ];
    await this.db.insert(roles).values(roleNames);
  }

  public async getUsers() {
    return await this.db.query.users.findMany({
      columns: {
        password: false,
        deletedAt: false,
      },
      with: {
        role: true,
      },
    });
  }

  public async storeUser(user: CreateUserDto) {
    const passHash = await this.defaultPasswordHash();

    const payload = {
      ...user,
      password: passHash,
      role_id: 1,
    };
    const [newUser] = await this.db
      .insert(users)
      .values(payload)
      .returning({ id: users.id, name: users.name, email: users.email });
    return newUser;
  }

  public async updateUser(id: string, user: CreateUserDto) {
    const [currentUser] = await this.db
      .update(users)
      .set(user)
      .where(eq(users.id, parseInt(id)))
      .returning({ id: users.id, name: users.name, email: users.email });
    return currentUser;
  }
}
