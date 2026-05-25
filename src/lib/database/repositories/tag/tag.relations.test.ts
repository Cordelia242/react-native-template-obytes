// src/lib/database/repositories/tag/tag.relations.test.ts
import type { DrizzleDB } from '../_shared/types';
import {
  addTagToTransaction,
  findTransactionCountByTag,
  removeTagFromTransaction,
} from './tag.relations';

function makeMockChain(opts: { getResult?: any; allResult?: any[] } = {}) {
  const chain: any = {};
  ['insert', 'values', 'delete', 'select', 'from', 'where'].forEach((m) => {
    chain[m] = jest.fn(() => chain);
  });
  chain.run = jest.fn();
  chain.get = jest.fn(() => opts.getResult ?? undefined);
  chain.all = jest.fn(() => opts.allResult ?? []);
  return chain as DrizzleDB;
}

describe('addTagToTransaction', () => {
  it('inserts into transaction_tag without throwing', () => {
    const db = makeMockChain();
    expect(() => addTagToTransaction(db, 'tag-1', 'tx-1')).not.toThrow();
    expect(db.insert).toHaveBeenCalled();
  });
});

describe('removeTagFromTransaction', () => {
  it('deletes from transaction_tag without throwing', () => {
    const db = makeMockChain();
    expect(() => removeTagFromTransaction(db, 'tag-1', 'tx-1')).not.toThrow();
    expect(db.delete).toHaveBeenCalled();
  });
});

describe('findTransactionCountByTag', () => {
  it('returns the count of rows', () => {
    const db = makeMockChain({ allResult: [{ tagId: 'tag-1', transactionId: 'tx-1' }, { tagId: 'tag-1', transactionId: 'tx-2' }] });
    expect(findTransactionCountByTag(db, 'tag-1')).toBe(2);
  });

  it('returns 0 when no transactions use the tag', () => {
    const db = makeMockChain({ allResult: [] });
    expect(findTransactionCountByTag(db, 'tag-1')).toBe(0);
  });
});
