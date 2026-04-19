import {
  pgTable,
  integer,
  text,
  varchar,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { series } from './series';

export const episodes = pgTable('episodes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  imdbId: varchar({ length: 20 }).unique(),
  title: varchar({ length: 255 }),
  season: varchar({ length: 20 }),
  episodeNumber: integer().notNull(),
  plot: text(),
  urlVideo: text(),
  runtimeSeconds: integer(),
  releaseDate: date(),
  seriesId: integer(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(),
});

export const episodesRelations = relations(episodes, ({ one }) => ({
  series: one(series, {
    fields: [episodes.seriesId],
    references: [series.id],
  }),
}));
