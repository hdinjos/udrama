import countries from './datas/country.json';
import { db } from '../database';
import * as schema from '../schemas';

export async function seedCountries() {
  await db.insert(schema.countries).values(countries);
  console.log('Countries seeded successfully');
}
