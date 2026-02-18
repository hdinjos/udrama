import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../database/schemas';
import 'dotenv/config';

export function createDatabase(connectionString: string) {
  console.log({ connectionString });
  const pool = new Pool({
    connectionString,
  });

  return drizzle({
    client: pool,
    casing: 'snake_case',
    schema,
  });
}

export const db = createDatabase(process.env.DATABASE_URL!);
