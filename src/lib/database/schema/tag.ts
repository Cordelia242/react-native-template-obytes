import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tags = sqliteTable('tag', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: text('created_at').notNull(),
});
