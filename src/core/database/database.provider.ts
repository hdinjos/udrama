import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import * as schema from '../database/schemas';

export const DRIZZLE = 'DRIZZLE';

export const databaseProvider = {
  provide: DRIZZLE,
  useFactory: (configService: ConfigService) => {
    const pool = new Pool({
      connectionString: configService.getOrThrow('database.url'),
    });

    return drizzle({ client: pool, casing: 'snake_case', schema });
  },
  inject: [ConfigService],
};
