import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const countries = pgTable('countries', {
  code: varchar({ length: 3 }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(),
});
