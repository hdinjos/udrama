import { Module, Global } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { DrizzleService } from './drizzle.service';

@Global()
@Module({
  providers: [databaseProvider, DrizzleService],
  exports: [databaseProvider, DrizzleService],
})
export class DatabaseModule {}
