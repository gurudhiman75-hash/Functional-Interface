import assert from 'node:assert/strict';
import {
  MIS_PERMANENT_QL_ALLOCATION_STATE,
  MIS_PERMANENT_QL_BY_CANONICAL_CANDIDATE,
  MIS_PERMANENT_QL_IDS,
  MIS_PERMANENT_QL_REGISTRY,
  MIS_SOURCE_THIN_CANONICAL_HOLDS,
  permanentQlForMisCandidate,
} from './MIS-PERMANENT-QL-REGISTRY';

assert.equal(MIS_PERMANENT_QL_REGISTRY.length, 73);
assert.equal(MIS_PERMANENT_QL_IDS.length, 73);
assert.equal(new Set(MIS_PERMANENT_QL_IDS).size, 73);
assert.equal(new Set(MIS_PERMANENT_QL_REGISTRY.map((entry) => entry.canonicalCandidateId)).size, 73);
assert.equal(MIS_PERMANENT_QL_ALLOCATION_STATE.canonicalSemanticAuthorityCount, 75);
assert.equal(MIS_PERMANENT_QL_ALLOCATION_STATE.allocatedPermanentQlCount, 73);
assert.deepEqual([...MIS_SOURCE_THIN_CANONICAL_HOLDS], ['MIS-CAND-034', 'MIS-CAND-095']);

for (let index = 0; index < MIS_PERMANENT_QL_IDS.length; index += 1) {
  assert.equal(MIS_PERMANENT_QL_IDS[index], 'MIS-QL-' + String(index + 1).padStart(3, '0'));
}
for (const hold of MIS_SOURCE_THIN_CANONICAL_HOLDS) {
  assert.equal(MIS_PERMANENT_QL_BY_CANONICAL_CANDIDATE[hold], undefined);
  assert.equal(permanentQlForMisCandidate(hold), null);
}

// Renderer / inverse / competition aliases must resolve to the canonical QL, never create another QL.
assert.equal(permanentQlForMisCandidate('MIS-CAND-035'), permanentQlForMisCandidate('MIS-CAND-011'));
assert.equal(permanentQlForMisCandidate('MIS-CAND-057'), permanentQlForMisCandidate('MIS-CAND-001'));
assert.equal(permanentQlForMisCandidate('MIS-CAND-079'), permanentQlForMisCandidate('MIS-CAND-001'));
assert.equal(permanentQlForMisCandidate('MIS-CAND-109'), permanentQlForMisCandidate('MIS-CAND-003'));
assert.equal(permanentQlForMisCandidate('MIS-CAND-110'), permanentQlForMisCandidate('MIS-CAND-016'));

assert.equal(MIS_PERMANENT_QL_ALLOCATION_STATE.activeQlCount, 0);
assert.equal(MIS_PERMANENT_QL_ALLOCATION_STATE.questionBankWritableCount, 0);
assert.equal(MIS_PERMANENT_QL_ALLOCATION_STATE.testEligibleCount, 0);
assert.equal(MIS_PERMANENT_QL_ALLOCATION_STATE.publiclyPublishableCount, 0);

console.log('MIS-001 permanent QL allocation audit passed: 73 allocated, 2 source-thin holds.');
