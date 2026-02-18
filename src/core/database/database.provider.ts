import { ConfigService } from '@nestjs/config';
import { createDatabase } from './database';

export const DRIZZLE = 'DRIZZLE';

export const databaseProvider = {
  provide: DRIZZLE,
  useFactory: (configService: ConfigService) => {
    return createDatabase(configService.getOrThrow('database.url'));
  },
  inject: [ConfigService],
};
