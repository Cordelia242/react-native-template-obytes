// src/lib/database/repositories/tag/tag.queries.ts
import type { DrizzleDB, Tag } from '../_shared/types';

import { eq } from 'drizzle-orm';
import { tags } from '../../schema';

export function findAllTags(db: DrizzleDB): Tag[] {
  return db.select().from(tags).all();
}

export function findTagById(db: DrizzleDB, id: string): Tag | undefined {
  return db.select().from(tags).where(eq(tags.id, id)).get();
}
