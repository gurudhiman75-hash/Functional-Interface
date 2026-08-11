import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP004_AUTHORITY_CONSOLIDATION_VERSION,
  RNK_CP004_CONSOLIDATED_AUTHORITY_IDS,
  RNK_CP004_OPEN_AUTHORITY_CANDIDATES,
  RNK_CP004_OWNERSHIP_BOUNDARY,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004ConsolidatedQuestion,
  type RnkCp004ConsolidatedAuthorityId,
  type RnkCp004ConsolidatedQuestion,
} from './cp004-authority-consolidation-v1';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-authority-consolidation-v1-output';
mkdirSync(outputDirectory, { recursive: true });

const runtime = RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.flatMap((prototypeId) =>
  Array.from({ length: 240 }, (_, seed) => generateRnkCp004ConsolidatedQuestion(prototypeId, seed)),
);

const counts = new Map<RnkCp004ConsolidatedAuthorityId, number>();
const sourcePrototypes = new Map<RnkCp004ConsolidatedAuthorityId, Set<string>>();
const parameters = new Map<RnkCp004ConsolidatedAuthorityId, Set<string>>();
const proofContracts = new Map<RnkCp004ConsolidatedAuthorityId, Set<string>>();
const answerSemantics = new Map<RnkCp004ConsolidatedAuthorityId, Set<string>>();
const decisions = new Map<RnkCp004ConsolidatedAuthorityId, Set<string>>();

for (const question of runtime) {
  const profile = question.reviewMetadata.authorityConsolidationProfile;
  assert(question.reviewMetadata.examAuthenticityStatus === 'MANUAL_ENGLISH_APPROVED', `Manual approval lost at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.sourceInverseStatus === 'EXPANSION_ACTIVE', `Inverse expansion lost at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.authorityConsolidationStatus === 'ACTIVE', `Consolidation status missing at ${question.prototypeId}:${question.seed}`);
  assert(profile.version === RNK_CP004_AUTHORITY_CONSOLIDATION_VERSION, `Consolidation version mismatch at ${question.prototypeId}:${question.seed}`);
  assert(profile.sourcePrototypeId === question.prototypeId, `Source prototype mismatch at ${question.prototypeId}:${question.seed}`);
  assert(profile.answerSemantic === question.answerSemantic, `Answer semantic mismatch at ${question.prototypeId}:${question.seed}`);
  assert(profile.ownership === 'RNK-CP-004', `Ownership mismatch at ${question.prototypeId}:${question.seed}`);
  assert(profile.permanentQlId === null, `Premature QL allocation at ${question.prototypeId}:${question.seed}`);
  assert(profile.freezeEligible === false, `Premature freeze eligibility at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication enabled at ${question.prototypeId}:${question.seed}`);

  const authority = profile.consolidatedAuthorityId;
  counts.set(authority, (counts.get(authority) ?? 0) + 1);
  const sourceSet = sourcePrototypes.get(authority) ?? new Set<string>();
  sourceSet.add(question.prototypeId);
  sourcePrototypes.set(authority, sourceSet);
  const parameterSet = parameters.get(authority) ?? new Set<string>();
  parameterSet.add(profile.parameter);
  parameters.set(authority, parameterSet);
  const proofSet = proofContracts.get(authority) ?? new Set<string>();
  proofSet.add(profile.proofContract);
  proofContracts.set(authority, proofSet);
  const semanticSet = answerSemantics.get(authority) ?? new Set<string>();
  semanticSet.add(profile.answerSemantic);
  answerSemantics.set(authority, semanticSet);
  const decisionSet = decisions.get(authority) ?? new Set<string>();
  decisionSet.add(profile.decision);
  decisions.set(authority, decisionSet);
}

assert(runtime.length === 2640, `Expected 2640 consolidation records, found ${runtime.length}`);
assert(RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length === 11, 'Source prototype count changed');
assert(RNK_CP004_CONSOLIDATED_AUTHORITY_IDS.length === 9, 'Consolidated authority count must be nine');
assert(counts.size === 9, `Expected nine represented authorities, found ${counts.size}`);

const expectedCounts: Record<RnkCp004ConsolidatedAuthorityId, number> = {
  ENDPOINT_ENTITY: 480,
  ENTITY_AT_POSITION: 480,
  RANK_OF_NAMED_ENTITY: 240,
  COMPLETE_ORDER: 240,
  RELATIVE_ORDER_OF_PAIR: 240,
  EXACT_RANK_DIFFERENCE_OF_PAIR: 240,
  IMMEDIATE_NEIGHBOUR: 240,
  DEFINITELY_TRUE_RELATION: 240,
  MISSING_COMPARISON: 240,
};
for (const authority of RNK_CP004_CONSOLIDATED_AUTHORITY_IDS) {
  assert(counts.get(authority) === expectedCounts[authority], `Runtime count mismatch for ${authority}`);
  assert(proofContracts.get(authority)?.size === 1, `Mixed proof contracts remain in ${authority}`);
  assert(answerSemantics.get(authority)?.size === 1, `Mixed answer semantics remain in ${authority}`);
  assert(decisions.get(authority)?.size === 1, `Mixed consolidation decisions remain in ${authority}`);
}

assert(sourcePrototypes.get('ENDPOINT_ENTITY')?.size === 2, 'Endpoint merge must contain highest and lowest sources');
assert(parameters.get('ENDPOINT_ENTITY')?.size === 2, 'Endpoint direction parameters are incomplete');
assert(decisions.get('ENDPOINT_ENTITY')?.has('MERGE_AS_QUERY_PARAMETER'), 'Endpoint merge decision missing');
assert(sourcePrototypes.get('ENTITY_AT_POSITION')?.size === 2, 'Position merge must contain explicit and middle sources');
assert(parameters.get('ENTITY_AT_POSITION')?.size === 2, 'Position mode parameters are incomplete');
assert(decisions.get('ENTITY_AT_POSITION')?.has('MERGE_AS_QUERY_PARAMETER'), 'Position merge decision missing');

for (const authority of RNK_CP004_CONSOLIDATED_AUTHORITY_IDS.filter((item) =>
  item !== 'ENDPOINT_ENTITY' && item !== 'ENTITY_AT_POSITION'
)) {
  assert(sourcePrototypes.get(authority)?.size === 1, `${authority} should remain a singleton authority`);
  assert(decisions.get(authority)?.has('KEEP_AS_DISTINCT_AUTHORITY'), `${authority} distinct decision missing`);
}

assert(RNK_CP004_OWNERSHIP_BOUNDARY.exactUniqueMultiEntityOrder === 'RNK-CP-004', 'CP-004 ownership boundary changed');
assert(RNK_CP004_OWNERSHIP_BOUNDARY.presentationLedRowQueueMeritRace === 'CONTEXT_ONLY_SOLVER_DECIDES', 'Presentation contexts must not own a checkpoint');
assert(RNK_CP004_OWNERSHIP_BOUNDARY.attributeLedHeightAgeMarksWeight === 'CONTEXT_ONLY_SOLVER_DECIDES', 'Attribute words must not own a checkpoint');
assert(RNK_CP004_OWNERSHIP_BOUNDARY.partialOrderPossibleImpossibleCannotDetermine === 'RNK-CP-005', 'Partial-order ownership must remain CP-005');
assert(RNK_CP004_OWNERSHIP_BOUNDARY.sharedMultiQuestionRankingSets === 'ASSEMBLY_INFRASTRUCTURE', 'Shared sets must remain infrastructure');
assert(RNK_CP004_OPEN_AUTHORITY_CANDIDATES.definitelyFalseRelation === 'COVERED_BY_RNK_CP005_RELATION_TRUTH_STATUS_CANNOT', 'Definitely-false relation must map to CP-005 truth status');
assert(RNK_CP004_OPEN_AUTHORITY_CANDIDATES.cannotDetermineRelation === 'COVERED_BY_RNK_CP005_RELATION_TRUTH_STATUS_PAIR_STATUS', 'Cannot-determine relation must map to CP-005 pair status');
assert(RNK_CP004_OPEN_AUTHORITY_CANDIDATES.possibleOrImpossibleRelation === 'COVERED_BY_RNK_CP005_RELATION_TRUTH_STATUS', 'Possible/impossible relation must map to CP-005 truth status');
assert(RNK_CP004_OPEN_AUTHORITY_CANDIDATES.minimumOrMaximumPossibleRank === 'COVERED_BY_RNK_CP005_POSSIBLE_RANK_BOUND', 'Possible rank bounds must map to CP-005');

const matrix = RNK_CP004_CONSOLIDATED_AUTHORITY_IDS.map((authority) => ({
  authority,
  runtimeQuestions: counts.get(authority),
  sourcePrototypeCount: sourcePrototypes.get(authority)?.size,
  sourcePrototypes: [...(sourcePrototypes.get(authority) ?? [])].sort(),
  parameters: [...(parameters.get(authority) ?? [])].sort(),
  proofContract: [...(proofContracts.get(authority) ?? [])][0],
  answerSemantic: [...(answerSemantics.get(authority) ?? [])][0],
  decision: [...(decisions.get(authority) ?? [])][0],
}));

const report = {
  checkpointId: 'RNK-CP-004',
  status: 'ENGLISH_APPROVED_AUTHORITY_CONSOLIDATION_ACTIVE',
  consolidationVersion: RNK_CP004_AUTHORITY_CONSOLIDATION_VERSION,
  sourcePrototypeCount: RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.length,
  consolidatedAuthorityCandidateCount: RNK_CP004_CONSOLIDATED_AUTHORITY_IDS.length,
  runtimeQuestionCount: runtime.length,
  mergeDecisions: {
    highestAndLowest: 'MERGED_INTO_ENDPOINT_ENTITY_WITH_DIRECTION_PARAMETER',
    explicitRankAndMiddle: 'MERGED_INTO_ENTITY_AT_POSITION_WITH_POSITION_MODE_PARAMETER',
  },
  distinctAuthorityDecisions: {
    rankOfNamedEntity: 'KEEP',
    completeOrder: 'KEEP',
    relativeOrderOfPair: 'KEEP',
    exactRankDifferenceOfPair: 'KEEP',
    immediateNeighbour: 'KEEP',
    definitelyTrueRelation: 'KEEP',
    missingComparison: 'KEEP',
  },
  authorityMatrix: matrix,
  ownershipBoundary: RNK_CP004_OWNERSHIP_BOUNDARY,
  openAuthorityCandidates: RNK_CP004_OPEN_AUTHORITY_CANDIDATES,
  permanentQlCount: null,
  provisionalPermanentAuthorityCandidateCount: 9,
  proposedFutureRangeIfFreezeProofPasses: 'RNK-QL-027..035',
  proposedRangeAllocated: false,
  nextAvailableQlId: 'RNK-QL-027',
  nextPhase: 'PERMANENT_RUNTIME_PROJECTION_AND_FREEZE_PROOF',
  lifecycle: {
    englishManualApproval: 'APPROVED',
    discoveryFrozen: false,
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

const markdown = [
  '# RNK-CP-004 Authority Consolidation V1',
  '',
  '> English V7 is manually approved. The later book-to-QL reset supersedes the original provisional checkpoint labels in this historical consolidation evidence.',
  '',
  `Source forms: **${report.sourcePrototypeCount}**  `,
  `Consolidated candidates: **${report.consolidatedAuthorityCandidateCount}**  `,
  `Runtime evidence: **${report.runtimeQuestionCount} questions**`,
  '',
  '| Candidate authority | Source forms | Decision | Proof contract | Answer semantic |',
  '|---|---:|---|---|---|',
  ...matrix.map((row) => `| ${row.authority} | ${row.sourcePrototypeCount} | ${row.decision} | ${row.proofContract} | ${row.answerSemantic} |`),
  '',
  '## Merge decisions',
  '',
  '- `HIGHEST_ENTITY` and `LOWEST_ENTITY` merge into `ENDPOINT_ENTITY`; endpoint direction is a parameter.',
  '- `ENTITY_AT_EXACT_RANK` and `MIDDLE_ENTITY` merge into `ENTITY_AT_POSITION`; explicit versus derived-middle position is a parameter.',
  '- Rank lookup, complete order, pair direction, exact distance, immediate neighbour, definitely-true relation and missing comparison retain distinct proof or output contracts.',
  '',
  '## Corrected ownership boundary',
  '',
  '- CP-004: exact unique multi-entity order from comparison clues.',
  '- CP-005: incomplete comparison graphs with multiple valid rankings, including truth status and possible-rank bounds.',
  '- CP-006: tied/non-strict ranking only after source evidence.',
  '- CP-007: advanced mixed transformations after a fresh gap audit.',
  '- Shared multi-question sets: assembly infrastructure, not checkpoint ownership.',
  '- Row/queue/merit/race and height/age/marks/weight words: context only; solver contract decides ownership.',
  '',
  '## Historical note',
  '',
  'The original CP-005..008 labels in this discovery-era audit were provisional and are superseded by the RNK-001 book-to-QL reset and CP-005 QL-034 ownership audit.',
  '',
].join('\n');

writeFileSync(join(outputDirectory, 'cp004-authority-consolidation-v1-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'RNK-CP-004-Authority-Consolidation-V1.md'), `${markdown}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
