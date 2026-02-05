import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from './database.provider';
import type { DB } from './database.type';

@Injectable()
export class DrizzleService {
  constructor(@Inject(DRIZZLE) public db: DB) {}
}
