import assert from 'node:assert/strict';

import { buildRnkCp004PermanentRuntime } from './cp004-permanent-runtime-v1';
import { localizeRnkCp004PermanentQuestion } from './cp004-localization-review-v1';

const canonical = buildRnkCp004PermanentRuntime();
const queryKinds = new Map<string, number>();
const inverseVariants = new Set<string>();
const misconceptionIds = new Set<string>();

for (const source of canonical) {
  const queryKind = source.displayedEvidence.query.kind;
  queryKinds.set(queryKind, (queryKinds.get(queryKind) ?? 0) + 1);
  inverseVariants.add(source.reviewMetadata.sourceInverseProfile.variant);
  source.options.forEach((option) => misconceptionIds.add(option.misconceptionId));

  for (const locale of ['hi-IN', 'pa-IN'] as const) {
    const localized = localizeRnkCp004PermanentQuestion(source, locale);
    assert.equal(localized.options.length, 4);
    assert.equal(localized.answer, localized.options[localized.correctIndex]!.label);
    assert.ok(localized.stem.trim().length > 0);
    assert.ok(localized.explanation.stepByStepSolution.length >= 2);
    assert.equal(localized.explanation.optionAnalysis.length, 4);
  }
}

assert.deepEqual([...queryKinds.keys()].sort(), [
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
assert.deepEqual([...inverseVariants].sort(), [
  'CANONICAL',
  'ENTITY_AT_RANK_FROM_BOTTOM',
  'ORDER_LOWEST_TO_HIGHEST',
  'RANK_FROM_BOTTOM',
].sort());

// Frozen V13/V14 pair-option vocabulary. These replace the older discovery-era
// RELATION_REVERSED / DISTANCE_OFF_BY_ONE / ASSUMED_ADJACENCY assumptions.
for (const required of [
  'CORRECT',
  'REVERSE_DIRECTION',
  'SAME_RANK_CONTRADICTION',
  'CANNOT_DETERMINE_CONTRADICTION',
  'NUMBER_BETWEEN_CONFUSION',
  'INCLUSIVE_COUNT_CONFUSION',
]) {
  assert.ok(misconceptionIds.has(required), `Missing frozen CP004 misconception ${required}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  canonicalQuestions: canonical.length,
  queryKinds: Object.fromEntries(queryKinds),
  inverseVariants: [...inverseVariants].sort(),
  misconceptionIds: [...misconceptionIds].sort(),
  frozenPairContractVocabulary: [
    'CORRECT',
    'REVERSE_DIRECTION',
    'SAME_RANK_CONTRADICTION',
    'CANNOT_DETERMINE_CONTRADICTION',
    'NUMBER_BETWEEN_CONFUSION',
    'INCLUSIVE_COUNT_CONFUSION',
  ],
}, null, 2));
