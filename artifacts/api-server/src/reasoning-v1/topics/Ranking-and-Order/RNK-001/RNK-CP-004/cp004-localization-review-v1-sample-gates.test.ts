import assert from 'node:assert/strict';

import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';

const REVIEW_ORDINALS = [1, 2, 6, 17, 48, 97, 152, 191] as const;
const canonical = buildRnkCp004PermanentRuntime();
const byQl = new Map<string, typeof canonical>();

for (const question of canonical) {
  const qlId = question.reviewMetadata.permanentProfile.permanentQlId;
  const existing = byQl.get(qlId) ?? [];
  byQl.set(qlId, [...existing, question]);
}

assert.equal(byQl.size, 9);
let selected = 0;
const selectedVariants = new Set<string>();
const selectedContexts = new Set<string>();
const selectedPrototypes = new Set<string>();
const selectedQueryKinds = new Set<string>();

for (const questions of byQl.values()) {
  assert.equal(questions.length, 192);
  for (const ordinal of REVIEW_ORDINALS) {
    const question = questions.find(
      (item) => item.reviewMetadata.permanentProfile.permanentOrdinalWithinAuthority === ordinal,
    );
    assert.ok(question, `Missing review ordinal ${ordinal}`);
    selected += 1;
    selectedVariants.add(question.reviewMetadata.sourceInverseProfile.variant);
    selectedContexts.add(question.reviewMetadata.languageProfile.contextFamily);
    selectedPrototypes.add(question.prototypeId);
    selectedQueryKinds.add(question.displayedEvidence.query.kind);
  }
}

assert.equal(selected, 72);
assert.deepEqual([...selectedVariants].sort(), [
  'CANONICAL',
  'ENTITY_AT_RANK_FROM_BOTTOM',
  'ORDER_LOWEST_TO_HIGHEST',
  'RANK_FROM_BOTTOM',
].sort());
assert.equal(selectedContexts.size, 6);
assert.equal(selectedPrototypes.size, 11);
assert.deepEqual([...selectedQueryKinds].sort(), [
  'COMPLETE_ORDER',
  'ENTITY_AT_EXACT_RANK',
  'HIGHEST_ENTITY',
  'IMMEDIATE_NEIGHBOUR',
  'LOWEST_ENTITY',
  'MIDDLE_ENTITY',
  'MISSING_COMPARISON',
  'RANK_OF_NAMED_ENTITY',
  'RELATIVE_ORDER_OF_PAIR',
  'VALID_RANK_STATEMENT',
].sort());

console.log(JSON.stringify({
  status: 'PASS',
  selectedCanonicalQuestions: selected,
  totalLocalizedArtifactQuestions: selected * 2,
  selectedVariants: [...selectedVariants].sort(),
  selectedContexts: [...selectedContexts].sort(),
  selectedPrototypeCount: selectedPrototypes.size,
  selectedQueryKinds: [...selectedQueryKinds].sort(),
}, null, 2));
