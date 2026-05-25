// src/lib/database/repositories/tag/tag.relations.ts
import type { DrizzleDB } from '../_shared/types';

import { and, eq } from 'drizzle-orm';
import { transactionTags } from '../../schema';

export function addTagToTransaction(
  db: DrizzleDB,
  tagId: string,
  transactionId: string,
): void {
  db.insert(transactionTags).values({ tagId, transactionId }).run();
}

export function removeTagFromTransaction(
  db: DrizzleDB,
  tagId: string,
  transactionId: string,
): void {
  db
    .delete(transactionTags)
    .where(
      and(
        eq(transactionTags.tagId, tagId),
        eq(transactionTags.transactionId, transactionId),
      ),
    )
    .run();
}

export function findTransactionCountByTag(db: DrizzleDB, tagId: string): number {
  return db
    .select()
    .from(transactionTags)
    .where(eq(transactionTags.tagId, tagId))
    .all()
    .length;
}
