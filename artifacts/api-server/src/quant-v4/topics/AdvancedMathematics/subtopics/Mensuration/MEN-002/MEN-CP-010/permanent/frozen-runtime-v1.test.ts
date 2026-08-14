import assert from "node:assert/strict";
import {
  MEN_CP_010_PERMANENT_ALLOCATION,
  auditMenCp010PermanentAllocation,
} from "./allocation";
import {
  MEN_CP_010_PERMANENT_ENGLISH_FREEZE_AUTHORITY,
  generateMenCp010FrozenEnglishQuestion,
} from "./frozen-runtime-v1";
import { listMenCp010PermanentEnglishSources } from "./runtime-v2";
import { auditMenCp010PermanentEnglishReview } from "./review-v1";

const allocationAudit = auditMenCp010PermanentAllocation();
const reviewAudit = auditMenCp010PermanentEnglishReview();

assert.equal(allocationAudit.permanentQlCount, 26);
assert.equal(allocationAudit.firstQlId, "MEN-002-QL-124");
assert.equal(allocationAudit.lastQlId, "MEN-002-QL-149");
assert.equal(allocationAudit.contiguousQlRange, true);
assert.equal(allocationAudit.englishImplementationFrozen, true);
assert.equal(allocationAudit.lifecycleLocked, true);

assert.equal(reviewAudit.reviewRecordCount, 104);
assert.equal(reviewAudit.permanentQlCount, 26);
assert.deepEqual(reviewAudit.correctPositions, { A: 26, B: 26, C: 26, D: 26 });
assert.equal(reviewAudit.allVerified, true);
assert.equal(reviewAudit.allFourOptions, true);
assert.equal(reviewAudit.allUniqueOptions, true);
assert.equal(reviewAudit.allReviewStatesDistinctWithinQl, true);
assert.equal(reviewAudit.allReviewSourcesCovered, true);
assert.equal(reviewAudit.noEngineeringShorthand, true);
assert.equal(reviewAudit.naturalPercentageDisplay, true);
assert.equal(reviewAudit.capacityUnitsPresent, true);
assert.equal(reviewAudit.workedTeaching, true);
assert.equal(reviewAudit.productLocked, true);

let generated = 0;
const positions = [0, 0, 0, 0];
const sourceHits = new Set<string>();

for (const allocation of MEN_CP_010_PERMANENT_ALLOCATION) {
  const qlPositions = new Set<number>();
  for (let index = 0; index < 64; index += 1) {
    const q = generateMenCp010FrozenEnglishQuestion(
      allocation.qlId,
      `freeze-${String(index).padStart(2, "0")}`,
    );
    generated += 1;
    positions[q.correctIndex] += 1;
    qlPositions.add(q.correctIndex);
    sourceHits.add(`${q.clusterId}:${q.sourceWave}:${q.sourceId}`);

    assert.equal(q.authority, MEN_CP_010_PERMANENT_ENGLISH_FREEZE_AUTHORITY);
    assert.equal(q.permanentQlId, allocation.qlId);
    assert.equal(q.templateId, allocation.templateId);
    assert.equal(q.solveModeId, allocation.solveModeId);
    assert.equal(q.clusterId, allocation.clusterId);
    assert.equal(q.language, "en");
    assert.equal(q.maturity, "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN");
    assert.equal(q.reviewStatus, "ENGLISH_REVIEW_APPROVED");
    assert.equal(q.englishImplementationFrozen, true);
    assert.equal(q.verification.valid, true);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((option) => option.display)).size, 4);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true);
    assert.ok(q.explanation.steps.some((step) => step.title === "Substitute and calculate"));

    assert.equal(q.active, false);
    assert.equal(q.questionStudioDiscoverable, false);
    assert.equal(q.questionBankStatus, "NOT_STORED");
    assert.equal(q.testEligibility, "INELIGIBLE");
    assert.equal(q.publiclyPublishable, false);
  }
  assert.equal(qlPositions.size, 4, `${allocation.qlId} must retain all four answer positions after freeze`);
}

const declaredSources = listMenCp010PermanentEnglishSources().flatMap((row) =>
  row.sources.map((source) => `${row.clusterId}:${source.kind}:${source.id}`),
);
for (const source of declaredSources) {
  assert.equal(sourceHits.has(source), true, `Frozen runtime did not exercise declared source: ${source}`);
}

assert.equal(generated, 26 * 64);
assert.equal(positions.every((count) => count > 0), true);

console.log(JSON.stringify({
  authority: MEN_CP_010_PERMANENT_ENGLISH_FREEZE_AUTHORITY,
  permanentQlCount: allocationAudit.permanentQlCount,
  qlRange: `${allocationAudit.firstQlId}..${allocationAudit.lastQlId}`,
  deterministicFrozenQuestionCount: generated,
  humanReviewRecordCount: reviewAudit.reviewRecordCount,
  declaredSourceCount: declaredSources.length,
  exercisedSourceCount: sourceHits.size,
  correctPositions: { A: positions[0], B: positions[1], C: positions[2], D: positions[3] },
  englishImplementationFrozen: true,
  productLocked: true,
}, null, 2));
