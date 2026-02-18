import { db } from '../database';
import * as schema from '../schemas';
import * as argon from 'argon2';

export async function seedUser() {
  const generatePassword = await argon.hash('ngadmin123');
  await db.insert(schema.users).values([
    {
      email: 'ngadmin@gmail.com',
      password: generatePassword,
    },
  ]);
  console.log('Users seeded successfully');
}
