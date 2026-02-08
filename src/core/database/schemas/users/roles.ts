import { integer, varchar, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  created_at: timestamp(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});
