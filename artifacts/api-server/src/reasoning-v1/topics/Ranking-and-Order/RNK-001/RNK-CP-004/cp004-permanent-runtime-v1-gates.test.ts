import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { RnkCp004Difficulty } from './cp004-foundation';
import {
  RNK_CP004_ENGLISH_DISCOVERY_FREEZE_VERSION,
  RNK_CP004_EXPECTED_PROJECTION_SHA256,
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
  RNK_CP004_PERMANENT_RUNTIME_VERSION,
  buildRnkCp004PermanentRuntime,
  rnkCp004PermanentProjectionSha256,
  type RnkCp004PermanentQlId,
} from './cp004-permanent-runtime-v1';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp004-permanent-runtime-v1-output';
mkdirSync(outputDirectory, { recursive: true });

const runtime = buildRnkCp004PermanentRuntime();
const projectionSha256 = rnkCp004PermanentProjectionSha256(runtime);
const expectedPinned = RNK_CP004_EXPECTED_PROJECTION_SHA256 !== 'PENDING_DIGEST_PIN';
if (expectedPinned) {
  assert(projectionSha256 === RNK_CP004_EXPECTED_PROJECTION_SHA256, `Projection digest drift: ${projectionSha256}`);
}

assert(runtime.length === 1728, `Expected 1728 permanent questions, found ${runtime.length}`);
assert(RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.length === 9, 'Permanent authority assignment count must be nine');

const qlCounts = new Map<RnkCp004PermanentQlId, number>();
const authorityCounts = new Map<string, number>();
const sourceCounts = new Map<string, number>();
const inverseCounts = new Map<string, number>();
const contextCounts = new Map<string, number>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 } satisfies Record<RnkCp004Difficulty, number>;
const answerCountsByQl = new Map<RnkCp004PermanentQlId, number[]>();
const semanticFingerprints = new Set<string>();

for (const question of runtime) {
  const permanent = question.reviewMetadata.permanentProfile;
  const consolidation = question.reviewMetadata.authorityConsolidationProfile;
  assert(permanent.runtimeVersion === RNK_CP004_PERMANENT_RUNTIME_VERSION, `Runtime version mismatch at ${question.prototypeId}:${question.seed}`);
  assert(permanent.freezeVersion === RNK_CP004_ENGLISH_DISCOVERY_FREEZE_VERSION, `Freeze version mismatch at ${question.prototypeId}:${question.seed}`);
  assert(permanent.questionsPerAuthority === 192, `Authority size mismatch at ${question.prototypeId}:${question.seed}`);
  assert(permanent.authorityId === consolidation.consolidatedAuthorityId, `Authority profile mismatch at ${question.prototypeId}:${question.seed}`);
  assert(permanent.permanentOrdinalWithinAuthority >= 1 && permanent.permanentOrdinalWithinAuthority <= 192, `Permanent ordinal out of range at ${question.prototypeId}:${question.seed}`);
  assert(question.options.length === 4, `Option count mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].answerKey === question.answerKey, `Correct option key mismatch at ${question.prototypeId}:${question.seed}`);
  assert(question.options[question.correctIndex].label === question.answer, `Correct option label mismatch at ${question.prototypeId}:${question.seed}`);
  assert(new Set(question.options.map((item) => item.answerKey)).size === 4, `Duplicate option key at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.examAuthenticityStatus === 'MANUAL_ENGLISH_APPROVED', `Approval missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.sourceInverseStatus === 'EXPANSION_ACTIVE', `Inverse status missing at ${question.prototypeId}:${question.seed}`);
  assert(question.reviewMetadata.authorityConsolidationStatus === 'ACTIVE', `Consolidation status missing at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `Question Studio enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.questionBankStatus === 'NOT_STORED', `Question Bank enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.testEligibility === 'INELIGIBLE', `Test eligibility enabled at ${question.prototypeId}:${question.seed}`);
  assert(question.lifecycle.publiclyPublishable === false, `Publication enabled at ${question.prototypeId}:${question.seed}`);

  qlCounts.set(permanent.permanentQlId, (qlCounts.get(permanent.permanentQlId) ?? 0) + 1);
  authorityCounts.set(permanent.authorityId, (authorityCounts.get(permanent.authorityId) ?? 0) + 1);
  sourceCounts.set(question.prototypeId, (sourceCounts.get(question.prototypeId) ?? 0) + 1);
  const inverse = question.reviewMetadata.sourceInverseProfile.variant;
  inverseCounts.set(inverse, (inverseCounts.get(inverse) ?? 0) + 1);
  const context = question.reviewMetadata.languageProfile.contextFamily;
  contextCounts.set(context, (contextCounts.get(context) ?? 0) + 1);
  difficultyCounts[question.difficulty] += 1;
  const answerCounts = answerCountsByQl.get(permanent.permanentQlId) ?? [0, 0, 0, 0];
  answerCounts[question.correctIndex] += 1;
  answerCountsByQl.set(permanent.permanentQlId, answerCounts);
  assert(!semanticFingerprints.has(question.reviewMetadata.normalizedSemanticFingerprint), `Permanent semantic duplicate at ${question.prototypeId}:${question.seed}`);
  semanticFingerprints.add(question.reviewMetadata.normalizedSemanticFingerprint);
}

for (const assignment of RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS) {
  assert(qlCounts.get(assignment.qlId) === 192, `Permanent QL count mismatch for ${assignment.qlId}`);
  assert(authorityCounts.get(assignment.authorityId) === 192, `Permanent authority count mismatch for ${assignment.authorityId}`);
  const answers = answerCountsByQl.get(assignment.qlId);
  assert(answers?.every((count) => count === 48), `Answer positions are not 48/48/48/48 for ${assignment.qlId}: ${answers}`);
}

assert(sourceCounts.get('RNK-CP004-PROT-HIGHEST-ENTITY') === 96, 'Highest endpoint source projection mismatch');
assert(sourceCounts.get('RNK-CP004-PROT-LOWEST-ENTITY') === 96, 'Lowest endpoint source projection mismatch');
assert(sourceCounts.get('RNK-CP004-PROT-ENTITY-AT-EXACT-RANK') === 96, 'Explicit position source projection mismatch');
assert(sourceCounts.get('RNK-CP004-PROT-MIDDLE-ENTITY') === 96, 'Middle position source projection mismatch');
for (const [prototypeId, count] of sourceCounts) {
  if (
    prototypeId !== 'RNK-CP004-PROT-HIGHEST-ENTITY'
    && prototypeId !== 'RNK-CP004-PROT-LOWEST-ENTITY'
    && prototypeId !== 'RNK-CP004-PROT-ENTITY-AT-EXACT-RANK'
    && prototypeId !== 'RNK-CP004-PROT-MIDDLE-ENTITY'
  ) {
    assert(count === 192, `Singleton source projection mismatch for ${prototypeId}: ${count}`);
  }
}

assert(inverseCounts.get('ENTITY_AT_RANK_FROM_BOTTOM') === 48, 'Permanent entity-bottom inverse count mismatch');
assert(inverseCounts.get('RANK_FROM_BOTTOM') === 96, 'Permanent named-rank bottom count mismatch');
assert(inverseCounts.get('ORDER_LOWEST_TO_HIGHEST') === 96, 'Permanent reverse-order count mismatch');
assert(inverseCounts.get('CANONICAL') === 1488, 'Permanent canonical inverse count mismatch');
assert(contextCounts.size === 6, `Expected six contexts, found ${contextCounts.size}`);
assert(semanticFingerprints.size === 1728, `Expected 1728 unique semantic fingerprints, found ${semanticFingerprints.size}`);

const report = {
  checkpointId: 'RNK-CP-004',
  status: expectedPinned ? 'ENGLISH_DISCOVERY_FREEZE_READY' : 'PERMANENT_RUNTIME_PROJECTION_PENDING_DIGEST_PIN',
  runtimeVersion: RNK_CP004_PERMANENT_RUNTIME_VERSION,
  freezeVersion: RNK_CP004_ENGLISH_DISCOVERY_FREEZE_VERSION,
  projectionSha256,
  expectedProjectionSha256: RNK_CP004_EXPECTED_PROJECTION_SHA256,
  projectionDigestPinned: expectedPinned,
  permanentAuthorityCount: RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.length,
  permanentRuntimeQuestionCount: runtime.length,
  permanentRange: 'RNK-QL-027..035',
  authorityAssignments: RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
  questionsPerAuthority: 192,
  qlCounts: Object.fromEntries([...qlCounts.entries()].sort()),
  authorityCounts: Object.fromEntries([...authorityCounts.entries()].sort()),
  sourcePrototypeCounts: Object.fromEntries([...sourceCounts.entries()].sort()),
  inverseVariantCounts: Object.fromEntries([...inverseCounts.entries()].sort()),
  contextCounts: Object.fromEntries([...contextCounts.entries()].sort()),
  difficultyCounts,
  answerPositionsPerQl: Object.fromEntries([...answerCountsByQl.entries()].sort()),
  normalizedSemanticDuplicates: 0,
  approvalAndArchitecture: {
    englishManualApproval: 'APPROVED',
    sourceInverseExpansion: 'PASS',
    authorityConsolidation: 'PASS',
  },
  lifecycle: {
    discoveryFrozen: expectedPinned,
    questionStudio: 'DISABLED',
    questionBank: 'NOT_STORED',
    testEligibility: 'INELIGIBLE',
    publicPublication: false,
    hindiPunjabi: 'NOT_STARTED',
  },
};

writeFileSync(join(outputDirectory, 'cp004-permanent-runtime-v1-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(outputDirectory, 'cp004-permanent-runtime-v1.json'), `${JSON.stringify(runtime, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
