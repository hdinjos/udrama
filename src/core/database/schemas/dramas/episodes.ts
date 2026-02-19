import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { series } from './series';

export const episodes = pgTable('episodes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  episodeNumber: integer().notNull(),
  urlVideo: text(),
  durations: integer(),
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
