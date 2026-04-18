import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core';
import { series_genres } from './series_genres';
import { relations } from 'drizzle-orm';
import { episodes } from './episodes';
import { countries } from '../countries/countries';

export const series = pgTable('series', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  imdbId: varchar({ length: 20 }).unique(),
  type: varchar({ length: 20 }),
  primaryTitle: varchar({ length: 255 }).notNull(),
  originalTitle: varchar({ length: 255 }),
  plot: text(),
  startYear: integer(),
  endYear: integer(),
  rating: decimal({ precision: 2, scale: 1 }),
  voteCount: integer(),
  countryId: varchar({ length: 3 }),
  thumbnailUrl: text(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
});

export const seriesRelations = relations(series, ({ one, many }) => ({
  series_genres: many(series_genres),
  episodes: many(episodes),
  country: one(countries, {
    fields: [series.countryId],
    references: [countries.code],
  }),
}));
