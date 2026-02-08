import { integer, varchar, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const roles = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
});

export const roleRelation = relations(roles, ({ many }) => ({
  users: many(users),
}));
