import { db } from '../database';
import * as schema from '../schemas';

export async function seedRoles() {
  await db.insert(schema.roles).values([
    {
      name: 'admin',
    },
    {
      name: 'user',
    },
  ]);
  console.log('Roles seeded successfully');
}
