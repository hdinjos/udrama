import { relations } from 'drizzle-orm';
import { users } from './users';
import { roles } from './roles';

export const userRelation = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const roleRelation = relations(roles, ({ many }) => ({
  users: many(users),
}));
