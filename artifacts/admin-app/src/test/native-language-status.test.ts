import { describe, expect, it } from 'vitest';
import { nativeLanguageStates } from '@/features/question-studio/NativeLanguageStatus';

const q = { stem: 's', explanation: 'e', options: ['a', 'b'], correctIndex: 0 };
const saved = (variants: unknown[]) => ({ savedNativeReview: { itemId: 'i', version: 1, packageId: 'P', source: { language: 'en', status: 'verified', ...q }, variants, saved: true, approved: false } } as never);

describe('nativeLanguageStates', () => {
  it('reports missing when nothing was stored at generation', () => {
    expect(nativeLanguageStates({ savedNativeReview: null }, ['en', 'hi', 'pa']).map((s) => s.state)).toEqual(['missing', 'missing']);
  });
  it('reports ready and blocked from stored variants', () => {
    const states = nativeLanguageStates(saved([{ language: 'hi', status: 'verified', ...q }, { language: 'pa', status: 'blocked', reason: 'parity' }]), ['en', 'hi', 'pa']);
    expect(states).toEqual([{ language: 'hi', state: 'ready' }, { language: 'pa', state: 'blocked', reason: 'parity' }]);
  });
  it('only lists languages the package supports', () => {
    expect(nativeLanguageStates({ savedNativeReview: null }, ['en', 'pa']).map((s) => s.language)).toEqual(['pa']);
  });
});
