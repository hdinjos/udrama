import * as schema from './schemas';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool();
const _db = drizzle({ client: pool, schema });

export type DB = typeof _db;
