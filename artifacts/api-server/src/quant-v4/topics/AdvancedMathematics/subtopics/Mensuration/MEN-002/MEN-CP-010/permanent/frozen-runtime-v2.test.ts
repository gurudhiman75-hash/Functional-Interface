import assert from "node:assert/strict";
import { MEN_CP_010_PERMANENT_ALLOCATION } from "./allocation";
import {
  MEN_CP_010_PERMANENT_ENGLISH_FREEZE_V2_AUTHORITY,
  generateMenCp010FrozenEnglishQuestionV2,
} from "./frozen-runtime-v2";
import {
  generateMenCp010ExamReadyEnglishQuestion,
  listMenCp010ExamReadyEnglishSources,
} from "./runtime-v3";
import { auditMenCp010ExamRealismReviewV2 } from "./review-v2";
import { auditMenCp010ExecutableCoverageV2 } from "./executable-coverage-audit-v2";
import { auditMenCp010ExamRealismProfiles } from "./exam-realism-profile-v2";

const reviewAudit = auditMenCp010ExamRealismReviewV2();
assert.equal(reviewAudit.reviewRecordCount, 208);
assert.equal(reviewAudit.permanentQlCount, 26);
assert.equal(reviewAudit.recordsPerQl, 8);
assert.deepEqual(reviewAudit.correctPositions, { A: 52, B: 52, C: 52, D: 52 });
assert.equal(reviewAudit.allVerified, true);
assert.equal(reviewAudit.allFourOptions, true);
assert.equal(reviewAudit.allUniqueOptions, true);
assert.equal(reviewAudit.allStatesDistinctWithinQl, true);
assert.equal(reviewAudit.sourceCoverageSatisfied, true);
assert.equal(reviewAudit.examSourcesCovered, true);
assert.equal(reviewAudit.examReviewRecordCount > 0, true);
assert.equal(reviewAudit.realisticBucketCapacity, true);
assert.equal(reviewAudit.cleanSscFrustumArithmetic, true);
assert.equal(reviewAudit.multiStepWorked, true);
assert.equal(reviewAudit.noGenericCrossTermTrapOnPyramid, true);
assert.equal(reviewAudit.productLocked, true);

const coverageAudit = auditMenCp010ExecutableCoverageV2();
assert.equal(coverageAudit.wave02ExecutableCount, 21);
assert.equal(coverageAudit.wave02ReplacementCount, 3);
assert.equal(coverageAudit.wave02MissingCount, 0);
assert.equal(coverageAudit.wave03ExecutableCount, 11);
assert.equal(coverageAudit.wave03MissingCount, 0);
assert.equal(coverageAudit.designRepresentationMissingCount, 0);
assert.equal(coverageAudit.coverageClosed, true);

const profileAudit = auditMenCp010ExamRealismProfiles();
assert.equal(profileAudit.profileCount, 26);
assert.deepEqual(profileAudit.priorities, { CORE: 7, STANDARD: 13, EXTENDED: 3, ENRICHMENT: 3 });
assert.equal(profileAudit.sscDefaultEnabledCount, 23);
assert.equal(profileAudit.bankingDefaultEnabledCount, 0);
assert.equal(profileAudit.punjabStateDefaultEnabledCount, 0);
assert.equal(profileAudit.productLocked, true);

const declaredSources = new Set(listMenCp010ExamReadyEnglishSources().map((row) => `${row.qlId}:${row.sourceId}`));
const sourceHits = new Set<string>();
const positions = [0, 0, 0, 0];
let generated = 0;

for (const allocation of MEN_CP_010_PERMANENT_ALLOCATION) {
  const qlPositions = new Set<number>();
  for (let index = 0; index < 256; index += 1) {
    for (const mode of ["base", "exam-v2"] as const) {
      const seed = `${mode}-freeze-v2-${allocation.qlId}-${String(index).padStart(4, "0")}`;
      const q = generateMenCp010FrozenEnglishQuestionV2(allocation.qlId, seed);
      generated += 1;
      qlPositions.add(q.correctIndex);
      positions[q.correctIndex] += 1;
      sourceHits.add(`${q.permanentQlId}:${q.sourceId}`);
      assert.equal(q.authority, MEN_CP_010_PERMANENT_ENGLISH_FREEZE_V2_AUTHORITY);
      assert.equal(q.permanentQlId, allocation.qlId);
      assert.equal(q.templateId, allocation.templateId);
      assert.equal(q.solveModeId, allocation.solveModeId);
      assert.equal(q.clusterId, allocation.clusterId);
      assert.equal(q.maturity, "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN");
      assert.equal(q.reviewStatus, "EXAM_REALISM_REVIEW_APPROVED");
      assert.equal(q.englishImplementationFrozen, true);
      assert.equal(q.verification.valid, true);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options.map((option) => option.display)).size, 4);
      assert.equal(q.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(q.options[q.correctIndex]?.isCorrect, true);
      assert.equal(q.active, false);
      assert.equal(q.questionStudioDiscoverable, false);
      assert.equal(q.questionBankStatus, "NOT_STORED");
      assert.equal(q.testEligibility, "INELIGIBLE");
      assert.equal(q.publiclyPublishable, false);
    }
  }
  assert.equal(qlPositions.size, 4, `${allocation.qlId}: V2 freeze must retain A/B/C/D coverage`);
}

for (const declared of declaredSources) {
  assert.equal(sourceHits.has(declared), true, `V2 frozen runtime did not exercise ${declared}`);
}

// Regression for the defect found during setter audit: a 3.14 state must show
// 3.14 in the worked substitution, not the integer prefix 3.
let decimalPiProbe: ReturnType<typeof generateMenCp010ExamReadyEnglishQuestion> | null = null;
for (let index = 0; index < 4096 && !decimalPiProbe; index += 1) {
  const q = generateMenCp010ExamReadyEnglishQuestion("MEN-002-QL-129", `decimal-pi-regression-${index}`);
  if (q.sourceId === "MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME" && q.stem.includes("π = 3.14")) decimalPiProbe = q;
}
assert.ok(decimalPiProbe, "Expected to find a base conical-frustum π=3.14 state");
const decimalPiWork = decimalPiProbe.explanation.steps.find((step) => step.title === "Substitute and calculate")?.body ?? "";
assert.equal(decimalPiWork.includes("3.14"), true);
assert.equal(/\bV = 3 ×/.test(decimalPiWork), false);

assert.equal(positions.every((count) => count > 0), true);

console.log(JSON.stringify({
  authority: MEN_CP_010_PERMANENT_ENGLISH_FREEZE_V2_AUTHORITY,
  permanentQlCount: MEN_CP_010_PERMANENT_ALLOCATION.length,
  deterministicFrozenQuestionCount: generated,
  reviewRecordCount: reviewAudit.reviewRecordCount,
  examReviewRecordCount: reviewAudit.examReviewRecordCount,
  declaredRuntimeSourceCount: declaredSources.size,
  exercisedRuntimeSourceCount: sourceHits.size,
  wave02ExecutableCount: coverageAudit.wave02ExecutableCount,
  wave02ReplacementCount: coverageAudit.wave02ReplacementCount,
  wave03ExecutableCount: coverageAudit.wave03ExecutableCount,
  sscDefaultEnabledQlCount: profileAudit.sscDefaultEnabledCount,
  bankingDefaultEnabledQlCount: profileAudit.bankingDefaultEnabledCount,
  punjabStateDefaultEnabledQlCount: profileAudit.punjabStateDefaultEnabledCount,
  decimalPiRegression: "PASS",
  productLocked: true,
}, null, 2));
