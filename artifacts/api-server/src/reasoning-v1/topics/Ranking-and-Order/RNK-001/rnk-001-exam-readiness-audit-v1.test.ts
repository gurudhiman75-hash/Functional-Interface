import assert from 'node:assert/strict';

import { RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS } from './RNK-CP-006/cp006-permanent-runtime-v1';
import { RNK_CP007_PERMANENT_QL_ID } from './RNK-CP-007/cp007-permanent-runtime-v1';

assert.deepEqual(
  RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
  ['RNK-QL-039', 'RNK-QL-040', 'RNK-QL-041'],
  'CP006 permanent authorities must remain QL039..041',
);

assert.equal(
  RNK_CP007_PERMANENT_QL_ID,
  'RNK-QL-042',
  'category composition must remain RNK-QL-042',
);

const allocated = new Set([
  ...RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
  RNK_CP007_PERMANENT_QL_ID,
]);
assert.equal(
  allocated.has('RNK-QL-043'),
  false,
  'presentation/delivery gaps must not allocate RNK-QL-043',
);

console.log(JSON.stringify({
  status: 'PASS',
  cp006: [...RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS],
  cp007Ql: RNK_CP007_PERMANENT_QL_ID,
  ql043Allocated: false,
}, null, 2));
