import {
  pgTable,
  integer,
  text,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';

export const genres = pgTable('genres', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  slug: varchar({ length: 255 }).unique().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp(),
  deletedAt: timestamp(),
});
