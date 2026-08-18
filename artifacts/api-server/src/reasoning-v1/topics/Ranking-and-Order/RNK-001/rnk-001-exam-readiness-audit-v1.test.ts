import { describe, expect, it } from 'vitest';

import { RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS } from './RNK-CP-006/cp006-permanent-runtime-v1';
import { RNK_CP007_PERMANENT_QL_ID } from './RNK-CP-007/cp007-permanent-runtime-v1';

describe('RNK-001 exam-readiness audit V1', () => {
  it('keeps CP006 authorities inside the frozen 001..042 range', () => {
    expect(RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId)).toEqual([
      'RNK-QL-039',
      'RNK-QL-040',
      'RNK-QL-041',
    ]);
  });

  it('keeps category composition on RNK-QL-042 rather than allocating a presentation QL', () => {
    expect(RNK_CP007_PERMANENT_QL_ID).toBe('RNK-QL-042');
  });

  it('reserves RNK-QL-043 for a future distinct mathematical authority', () => {
    const allocated = new Set([
      ...RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
      RNK_CP007_PERMANENT_QL_ID,
    ]);
    expect(allocated.has('RNK-QL-043')).toBe(false);
  });
});
