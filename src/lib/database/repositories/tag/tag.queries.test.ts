// src/lib/database/repositories/tag/tag.queries.test.ts
import type { DrizzleDB } from '../_shared/types';
import { findAllTags, findTagById } from './tag.queries';

function makeMockChain(opts: { allResult?: any[]; getResult?: any } = {}) {
  const chain: any = {};
  ['select', 'from', 'where'].forEach((m) => {
    chain[m] = jest.fn(() => chain);
  });
  chain.all = jest.fn(() => opts.allResult ?? []);
  chain.get = jest.fn(() => opts.getResult ?? undefined);
  return chain as DrizzleDB;
}

describe('findAllTags', () => {
  it('returns all tags', () => {
    const rows = [{ id: '1', name: 'Comida', createdAt: '2026-01-01' }];
    const db = makeMockChain({ allResult: rows });
    expect(findAllTags(db)).toEqual(rows);
  });

  it('returns empty array when none exist', () => {
    const db = makeMockChain({ allResult: [] });
    expect(findAllTags(db)).toEqual([]);
  });
});

describe('findTagById', () => {
  it('returns the tag when found', () => {
    const row = { id: '1', name: 'Comida', createdAt: '2026-01-01' };
    const db = makeMockChain({ getResult: row });
    expect(findTagById(db, '1')).toEqual(row);
  });

  it('returns undefined when not found', () => {
    const db = makeMockChain({ getResult: undefined });
    expect(findTagById(db, 'missing')).toBeUndefined();
  });
});
