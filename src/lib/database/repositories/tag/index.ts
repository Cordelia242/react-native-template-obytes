import type { DrizzleDB, Tag } from '../_shared/types';

import { createTag, deleteTag, updateTag } from './tag.commands';
import { findAllTags, findTagById } from './tag.queries';
import {
  addTagToTransaction,
  findTransactionCountByTag,
  removeTagFromTransaction,
} from './tag.relations';

type CreateInput = Omit<Tag, 'id' | 'createdAt'>;
type UpdateInput = Partial<Omit<Tag, 'id' | 'createdAt'>>;

export class TagRepository {
  constructor(private db: DrizzleDB) {}

  findAll(): Tag[] {
    return findAllTags(this.db);
  }

  findById(id: string): Tag | undefined {
    return findTagById(this.db, id);
  }

  create(data: CreateInput): Tag {
    return createTag(this.db, data);
  }

  update(id: string, data: UpdateInput): Tag {
    return updateTag(this.db, id, data);
  }

  delete(id: string): void {
    deleteTag(this.db, id);
  }

  addToTransaction(tagId: string, transactionId: string): void {
    addTagToTransaction(this.db, tagId, transactionId);
  }

  removeFromTransaction(tagId: string, transactionId: string): void {
    removeTagFromTransaction(this.db, tagId, transactionId);
  }

  countTransactions(tagId: string): number {
    return findTransactionCountByTag(this.db, tagId);
  }
}
