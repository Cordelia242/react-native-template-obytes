import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { tags } from './tag';
import { transactions } from './transaction';

export const transactionTags = sqliteTable(
  'transaction_tag',
  {
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    transactionId: text('transaction_id')
      .notNull()
      .references(() => transactions.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.tagId, t.transactionId] })],
);
