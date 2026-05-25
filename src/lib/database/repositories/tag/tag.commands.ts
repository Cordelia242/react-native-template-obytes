// src/lib/database/repositories/tag/tag.commands.ts
import type { DrizzleDB, NewTag, Tag } from '../_shared/types';

import { eq } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import { tags } from '../../schema';

type CreateTagInput = Omit<NewTag, 'id' | 'createdAt'>;

export function createTag(db: DrizzleDB, data: CreateTagInput): Tag {
  const now = new Date().toISOString();
  const result = db
    .insert(tags)
    .values({ id: randomUUID(), ...data, createdAt: now })
    .returning()
    .get();
  if (!result)
    throw new Error('Failed to create tag');
  return result;
}

type UpdateTagInput = Partial<Omit<NewTag, 'id' | 'createdAt'>>;

export function updateTag(db: DrizzleDB, id: string, data: UpdateTagInput): Tag {
  const result = db
    .update(tags)
    .set(data)
    .where(eq(tags.id, id))
    .returning()
    .get();
  if (!result)
    throw new Error(`Tag ${id} not found`);
  return result;
}

export function deleteTag(db: DrizzleDB, id: string): void {
  db.delete(tags).where(eq(tags.id, id)).run();
}
