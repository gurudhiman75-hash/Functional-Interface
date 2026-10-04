import { strict as assert } from "node:assert";

import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle.ts";
import { CALENDAR_PERMANENT_QL_IDS } from "./permanent-contracts.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import {
  generateCalendarSourceGapQuestion,
  type CalendarSourceGapQuestion,
} from "./source-gap-runtime.ts";
import {
  assertCalendarSourceGapIntegrity,
  CAL_001_SOURCE_GAP_INDEPENDENT_PROOF_AUTHORITY,
} from "./source-gap-verifier.ts";
import { assertCalendarPackageIntegrity } from "./verifier.ts";
import {
  CAL_001_PRODUCTION_RELEASE,
  runCal001QuestionStudioPipeline,
  toCal001QuestionStudioPreview,
} from "./question-studio-runtime.ts";
import {
  CAL001_STANDARD_QUESTION_STUDIO_PACKAGE_V1,
  generateCal001StandardQuestionStudioBatch,
} from "./question-studio-integration.ts";

const LANGUAGES = ["en", "hi", "pa"] as const;
const BANK = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

assert.equal(CAL_001_PRODUCTION_RELEASE.lifecycleStage, "BANK_ONLY");
assert.equal(CAL_001_PRODUCTION_RELEASE.questionBankWritable, true);
assert.equal(CAL_001_PRODUCTION_RELEASE.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(CAL_001_PRODUCTION_RELEASE.testEligible, false);
assert.equal(CAL_001_PRODUCTION_RELEASE.testEligibility, "INELIGIBLE");
assert.equal(CAL_001_PRODUCTION_RELEASE.mockTestEligible, false);
assert.equal(CAL_001_PRODUCTION_RELEASE.publiclyPublishable, false);
assert.equal(CAL_001_PRODUCTION_RELEASE.productionReleaseAuthorized, false);

assert.equal(CAL001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.lifecycleStage, BANK.stage);
assert.equal(CAL001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.questionBankWritable, true);
assert.equal(CAL001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.testEligible, false);
assert.equal(CAL001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.mockTestEligible, false);
assert.equal(CAL001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.publiclyPublishable, false);

let finalPipelineSurfaces = 0;
let bankEligibilityChecks = 0;
let normalProofSurfaces = 0;
let sourceGapProofSurfaces = 0;

for (const qlId of CALENDAR_PERMANENT_QL_IDS) {
  for (const language of LANGUAGES) {
    for (let seedIndex = 0; seedIndex < 8; seedIndex += 1) {
      const seed = `cal-post-closure:${qlId}:${language}:${seedIndex}`;
      const pkg = runCal001QuestionStudioPipeline(qlId, { language, seed });
      const preview = toCal001QuestionStudioPreview(pkg, seed);

      assert.equal(pkg.validation.valid, true);
      assert.ok(
        pkg.validation.checks.some(
          (check) => check.name === "independent-answer-proof" && check.passed,
        ),
      );
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
      assert.ok(pkg.traceability.independentAnswerProof);
      assert.equal(preview.lifecycleStage, "BANK_ONLY");
      assert.equal(preview.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(preview.questionBankWritable, true);
      assert.equal(preview.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(preview.testEligibility, "INELIGIBLE");
      assert.equal(preview.testEligible, false);
      assert.equal(preview.mockTestEligible, false);
      assert.equal(preview.publiclyPublishable, false);
      assert.equal(preview.productionReleaseAuthorized, false);
      assert.equal(preview.manualApprovalRequired, true);
      assert.equal(preview.automaticStudentPublication, false);

      finalPipelineSurfaces += 1;
      bankEligibilityChecks += 1;
    }
  }
}

for (const prototype of [
  "CAL-PQL-001",
  "CAL-PQL-008",
  "CAL-PQL-014",
  "CAL-PQL-021",
  "CAL-PQL-029",
  "CAL-PQL-040",
  "CAL-PQL-044",
] as const) {
  for (let seed = 0; seed < 32; seed += 1) {
    const question = generateCalendarQuestion(prototype, seed, "en-IN");
    assert.doesNotThrow(() => assertCalendarPackageIntegrity(question));
    normalProofSurfaces += 1;
  }
}

for (const prototype of [
  "CAL-GAP-PROT-001",
  "CAL-GAP-PROT-002",
  "CAL-GAP-PROT-003",
] as const) {
  for (let seed = 0; seed < 64; seed += 1) {
    const question = generateCalendarSourceGapQuestion(prototype, seed);
    assert.doesNotThrow(() => assertCalendarSourceGapIntegrity(question));
    sourceGapProofSurfaces += 1;
  }
}

// Independent verifier must fail closed if the generator's answer metadata drifts.
{
  const normal = generateCalendarQuestion("CAL-PQL-001", 37, "en-IN");
  const tampered = {
    ...normal,
    canonicalAnswer:
      typeof normal.canonicalAnswer === "number"
        ? (normal.canonicalAnswer + 1) % 7
        : "__CAL_TAMPERED__",
  } as typeof normal;
  assert.throws(
    () => assertCalendarPackageIntegrity(tampered),
    /independent verifier mismatch/i,
  );
}

{
  const sourceGap = generateCalendarSourceGapQuestion("CAL-GAP-PROT-003", 41);
  const tampered: CalendarSourceGapQuestion = {
    ...sourceGap,
    canonicalAnswer: Number(sourceGap.canonicalAnswer) + 1,
  };
  assert.throws(
    () => assertCalendarSourceGapIntegrity(tampered),
    /independent source-gap verifier mismatch/i,
  );
}

const adapter = await generateCal001StandardQuestionStudioBatch({
  packageId: "CAL-001",
  canonicalProblemId: "CAL-QL-020",
  language: "pa",
  count: 3,
  seed: "cal-post-closure-standard-adapter",
});
assert.equal(adapter.questions.length, 3);
for (const question of adapter.questions) {
  assert.equal(question.lifecycleStage, "BANK_ONLY");
  assert.equal(question.questionBankWritable, true);
  assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
}

console.log(JSON.stringify({
  status: "PASS_CAL_001_POST_CLOSURE_AUDIT_20261004",
  permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
  languages: LANGUAGES,
  finalPipelineSurfaces,
  bankEligibilityChecks,
  normalProofSurfaces,
  sourceGapProofSurfaces,
  sourceGapProofAuthority: CAL_001_SOURCE_GAP_INDEPENDENT_PROOF_AUTHORITY,
  lifecycle: {
    stage: CAL_001_PRODUCTION_RELEASE.lifecycleStage,
    questionBankWritable: CAL_001_PRODUCTION_RELEASE.questionBankWritable,
    acceptanceMode: CAL_001_PRODUCTION_RELEASE.questionBankAcceptanceMode,
    testEligible: CAL_001_PRODUCTION_RELEASE.testEligible,
    mockTestEligible: CAL_001_PRODUCTION_RELEASE.mockTestEligible,
    publiclyPublishable: CAL_001_PRODUCTION_RELEASE.publiclyPublishable,
  },
}, null, 2));
