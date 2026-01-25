import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from './database.provider';
import * as schema from '../database/schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class DrizzleService {
  constructor(@Inject(DRIZZLE) public db: NodePgDatabase<typeof schema>) {}
}
