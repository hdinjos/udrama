import {
  pgTable,
  integer,
  text,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { series_genres } from './series_genres';
import { relations } from 'drizzle-orm';

export const genres = pgTable('genres', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  slug: varchar({ length: 255 }).unique().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(),
});

export const genresRelations = relations(genres, ({ many }) => ({
  series_genres: many(series_genres),
}));
