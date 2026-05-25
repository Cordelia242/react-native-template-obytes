// src/lib/database/repositories/tag/tag.commands.test.ts
import type { DrizzleDB } from '../_shared/types';
import { createTag, deleteTag, updateTag } from './tag.commands';

jest.mock('expo-crypto', () => ({ randomUUID: jest.fn(() => 'test-uuid') }));

function makeMockChain(opts: { getResult?: any } = {}) {
  const chain: any = {};
  ['insert', 'values', 'update', 'set', 'where', 'returning', 'delete'].forEach((m) => {
    chain[m] = jest.fn(() => chain);
  });
  chain.get = jest.fn(() => opts.getResult ?? undefined);
  chain.run = jest.fn();
  return chain as DrizzleDB;
}

describe('createTag', () => {
  it('returns the created tag', () => {
    const created = { id: 'test-uuid', name: 'Comida', createdAt: expect.any(String) };
    const db = makeMockChain({ getResult: created });
    expect(createTag(db, { name: 'Comida' })).toEqual(created);
  });

  it('throws when insert returns nothing', () => {
    const db = makeMockChain({ getResult: undefined });
    expect(() => createTag(db, { name: 'Comida' })).toThrow('Failed to create tag');
  });
});

describe('updateTag', () => {
  it('returns the updated tag', () => {
    const updated = { id: '1', name: 'Transporte', createdAt: '2026-01-01' };
    const db = makeMockChain({ getResult: updated });
    expect(updateTag(db, '1', { name: 'Transporte' })).toEqual(updated);
  });

  it('throws when tag not found', () => {
    const db = makeMockChain({ getResult: undefined });
    expect(() => updateTag(db, 'missing', { name: 'X' })).toThrow('Tag missing not found');
  });
});

describe('deleteTag', () => {
  it('calls delete without throwing', () => {
    const db = makeMockChain();
    expect(() => deleteTag(db, '1')).not.toThrow();
    expect(db.delete).toHaveBeenCalled();
  });
});
