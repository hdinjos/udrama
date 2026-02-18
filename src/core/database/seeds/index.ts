import { seedCountries } from './country';

async function runSeed() {
  await seedCountries();
  process.exit(0);
}

runSeed();
