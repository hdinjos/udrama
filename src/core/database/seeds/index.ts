import { seedCountries } from './country';
import { seedRoles } from './roles';
import { seedUser } from './users';

async function runSeed() {
  await seedCountries();
  await seedRoles();
  await seedUser();

  process.exit(0);
}

runSeed();
