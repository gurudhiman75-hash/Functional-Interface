import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp002AuthorityQuestion,
  RNK_CP002_AUTHORITY_IDS,
} from './cp002-authority-runtime';

const SOURCE_DIMENSIONS = [
  'SAME_END_PEOPLE_BETWEEN',
  'MIXED_END_PEOPLE_BETWEEN_WITH_TOTAL',
  'SAME_END_POSITION_GAP',
  'MIXED_END_POSITION_GAP_WITH_TOTAL',
  'INVERSE_OFFSET_FROM_TWO_RANKS',
  'TARGET_RANK_FROM_DIRECT_OFFSET',
  'TARGET_RANK_FROM_BETWEEN_AND_ORDER',
  'SAME_END_POSITION_COMPARISON',
  'MIXED_END_POSITION_COMPARISON_WITH_TOTAL',
  'KNOWN_ORDER_TOTAL',
  'UNKNOWN_ORDER_MINIMUM_TOTAL',
  'UNKNOWN_ORDER_MAXIMUM_TOTAL',
  'EXACT_TOTAL_UNIQUE_BRANCH',
  'EXACT_TOTAL_INDETERMINATE_TWO_BRANCHES',
  'PROPOSED_TOTAL_FIRST_ORDER',
  'PROPOSED_TOTAL_SECOND_ORDER',
  'PROPOSED_TOTAL_IMPOSSIBLE',
  'ZERO_BETWEEN_EDGE',
  'ENDPOINT_POSITION_EDGE',
  'MERIT_ROW_QUEUE_PARITY',
] as const;

const DISPOSITIONS: Readonly<Record<(typeof SOURCE_DIMENSIONS)[number], string>> = {
  SAME_END_PEOPLE_BETWEEN: 'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS',
  MIXED_END_PEOPLE_BETWEEN_WITH_TOTAL: 'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS',
  SAME_END_POSITION_GAP: 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS',
  MIXED_END_POSITION_GAP_WITH_TOTAL: 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS',
  INVERSE_OFFSET_FROM_TWO_RANKS: 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS',
  TARGET_RANK_FROM_DIRECT_OFFSET: 'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION',
  TARGET_RANK_FROM_BETWEEN_AND_ORDER: 'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION',
  SAME_END_POSITION_COMPARISON: 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS',
  MIXED_END_POSITION_COMPARISON_WITH_TOTAL: 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS',
  KNOWN_ORDER_TOTAL: 'RNK-CP002-AUTH-05-TOTAL-FROM-MIXED-ENDS-KNOWN-ORDER',
  UNKNOWN_ORDER_MINIMUM_TOTAL: 'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER',
  UNKNOWN_ORDER_MAXIMUM_TOTAL: 'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER',
  EXACT_TOTAL_UNIQUE_BRANCH: 'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE',
  EXACT_TOTAL_INDETERMINATE_TWO_BRANCHES: 'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE',
  PROPOSED_TOTAL_FIRST_ORDER: 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS',
  PROPOSED_TOTAL_SECOND_ORDER: 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS',
  PROPOSED_TOTAL_IMPOSSIBLE: 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS',
  ZERO_BETWEEN_EDGE: 'CROSS_AUTHORITY_EDGE_COVERAGE',
  ENDPOINT_POSITION_EDGE: 'CROSS_AUTHORITY_EDGE_COVERAGE',
  MERIT_ROW_QUEUE_PARITY: 'RENDERER_PARAMETER_COVERAGE',
};

const DEFERRED_PATTERNS = {
  SHIFT_MOVE_OVERTAKE_INSERT_REMOVE: 'RNK-CP-003',
  INTERCHANGE_SWAP: 'RNK-CP-003',
  THREE_OR_MORE_PERSON_ORDER: 'RNK-CP-004',
  SHARED_PASSAGE: 'RNK-CP-005',
  MULTI_PERSON_PARTIAL_ORDER: 'RNK-CP-007',
  DATA_SUFFICIENCY_WRAPPER: 'DATA_SUFFICIENCY',
  FACING_OR_ADJACENCY_GEOMETRY: 'SEATING_ARRANGEMENT',
} as const;

const SEEDS_PER_AUTHORITY = 180;
const contexts = new Set<string>();
const authorityCounts = new Map<string, number>();
let zeroBetweenCases = 0;
let endpointCases = 0;
let uniqueTotalCases = 0;
let indeterminateCases = 0;
const orderStatuses = new Set<string>();
let runtimeChecks = 0;

for (const authorityId of RNK_CP002_AUTHORITY_IDS) {
  for (let seed = 0; seed < SEEDS_PER_AUTHORITY; seed += 1) {
    const question = generateRnkCp002AuthorityQuestion(authorityId, seed);
    authorityCounts.set(authorityId, (authorityCounts.get(authorityId) ?? 0) + 1);
    contexts.add(question.contextId);
    runtimeChecks += 1;

    if (question.normalizedState) {
      if (question.normalizedState.betweenCount === 0) zeroBetweenCases += 1;
      if (
        question.normalizedState.firstRankFromStart === 1 ||
        question.normalizedState.secondRankFromStart === 1 ||
        question.normalizedState.firstRankFromStart === question.normalizedState.total ||
        question.normalizedState.secondRankFromStart === question.normalizedState.total
      ) endpointCases += 1;
    }

    if (question.displayedEvidence.kind === 'EXACT_TOTAL_OR_INDETERMINATE') {
      if (question.answer === 'Cannot be determined') indeterminateCases += 1;
      else uniqueTotalCases += 1;
    }

    if (question.displayedEvidence.kind === 'PROPOSED_TOTAL_ORDER_STATUS') {
      orderStatuses.add(String(question.answer));
    }
  }
}

assert.equal(SOURCE_DIMENSIONS.length, 20);
assert.equal(Object.keys(DISPOSITIONS).length, SOURCE_DIMENSIONS.length);
assert.equal(runtimeChecks, RNK_CP002_AUTHORITY_IDS.length * SEEDS_PER_AUTHORITY);
assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
assert.equal(authorityCounts.size, RNK_CP002_AUTHORITY_IDS.length);
assert.ok([...authorityCounts.values()].every((count) => count === SEEDS_PER_AUTHORITY));
assert.ok(zeroBetweenCases > 0);
assert.ok(endpointCases > 0);
assert.ok(uniqueTotalCases > 0);
assert.ok(indeterminateCases > 0);
assert.deepEqual([...orderStatuses].sort(), [
  'The first person is nearer the start end',
  'The proposed total is impossible',
  'The second person is nearer the start end',
].sort());

const summary = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  closedSourceDimensionCount: SOURCE_DIMENSIONS.length,
  dispositions: DISPOSITIONS,
  deferredPatterns: DEFERRED_PATTERNS,
  openSourceDimensions: [],
  authorityCount: RNK_CP002_AUTHORITY_IDS.length,
  runtimeChecks,
  zeroBetweenCases,
  endpointCases,
  uniqueTotalCases,
  indeterminateCases,
  orderStatuses: [...orderStatuses].sort(),
  verdict: 'ELIGIBLE_FOR_ENGLISH_MANUAL_REVIEW',
  permanentQlCount: 0,
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'cp002-final-source-gap-audit.json'), `${JSON.stringify(summary, null, 2)}\n`);
}
console.log(JSON.stringify(summary, null, 2));
