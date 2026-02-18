import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { series } from './series';
import { genres } from './genres';

export const series_genres = pgTable(
  'series_genres',
  {
    seriesId: integer().notNull(),
    genreId: integer().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    deletedAt: timestamp(),
  },
  (t) => [primaryKey({ columns: [t.seriesId, t.genreId] })],
);

export const seriesGenresRelations = relations(series_genres, ({ one }) => ({
  series: one(series, {
    fields: [series_genres.seriesId],
    references: [series.id],
  }),
  genre: one(genres, {
    fields: [series_genres.genreId],
    references: [genres.id],
  }),
}));
