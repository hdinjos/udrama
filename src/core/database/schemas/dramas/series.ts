import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';

export const series = pgTable('series', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  year: integer().notNull(),
  realease_date: date(),
  country_id: integer(),
  thumbnail_url: text(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
});
