import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const dramas = pgTable('dramas', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  year: integer().notNull(),
  categoryId: integer(),
  description: text(),
  updatedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
});
