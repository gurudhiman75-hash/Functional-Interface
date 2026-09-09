import assert from "node:assert/strict";

import { getQuantV4ExamProfileContract } from "../common/exam-profile";
import {
  QUANT_V4_REAL_EXAM_ADVANCED_MATH_INTEGRATION_AUTHORITY,
  centralProfileAuthorityForRealExam,
  generateQuantV4RealExamSectionWithAdvancedMath,
  runQuantV4AdvancedMathRealExamIntegrationAudit,
} from "./quant-v4-real-exam-advanced-math-integration-p2";

const examIds = [
  "SSC_CGL_TIER_I",
  "SSC_CGL_TIER_II",
  "SSC_CHSL",
  "PSSSB",
  "PPSC",
  "PUNJAB_POLICE",
] as const;

assert.equal(
  QUANT_V4_REAL_EXAM_ADVANCED_MATH_INTEGRATION_AUTHORITY,
  "QUANT-V4-REAL-EXAM-ADVANCED-MATH-INTEGRATION-P2",
);

for (const examId of examIds) {
  const centralProfile = centralProfileAuthorityForRealExam(examId);
  const centralContract = getQuantV4ExamProfileContract(centralProfile);
  assert.equal(centralContract.optionCount, 4, `${examId} Advanced Mathematics must remain a four-option section.`);
  if (examId === "PSSSB" || examId === "PPSC" || examId === "PUNJAB_POLICE") {
    assert.equal(centralProfile, "PUNJAB_STATE", `${examId} must resolve through the merged Punjab central profile authority.`);
    assert.equal(centralContract.family, "PUNJAB_STATE");
    assert.equal(centralContract.deliveryStyle, "PUNJAB_STATE_OBJECTIVE");
  }

  const first = await generateQuantV4RealExamSectionWithAdvancedMath({
    examId,
    sectionIndex: 1,
    seed: `QUANT-V4-ADVANCED-MATH-INTEGRATION-PROBE:${examId}`,
  });
  const replay = await generateQuantV4RealExamSectionWithAdvancedMath({
    examId,
    sectionIndex: 1,
    seed: `QUANT-V4-ADVANCED-MATH-INTEGRATION-PROBE:${examId}`,
  });

  const advanced = first.questions.filter((question) =>
    question.slotKind === "ALGEBRA" || question.slotKind === "TRIGONOMETRY",
  );
  const replayAdvanced = replay.questions.filter((question) =>
    question.slotKind === "ALGEBRA" || question.slotKind === "TRIGONOMETRY",
  );

  assert.ok(advanced.length > 0, `${examId} structural section did not contain Advanced Mathematics slots.`);
  assert.equal(first.advancedMathReplacements, advanced.length, `${examId} did not replace every historical Algebra/Trigonometry gap.`);
  assert.equal(
    advanced.filter((question) => question.sourceKind === "CAPABILITY_GAP").length,
    0,
    `${examId} still exposes an Algebra/Trigonometry capability gap after adapter integration.`,
  );
  assert.ok(advanced.every((question) => question.sourceKind === "RUNTIME_GENERATED"));
  assert.ok(advanced.every((question) => question.optionCount === 4));
  assert.ok(advanced.every((question) => question.options.length === 4 && new Set(question.options).size === 4));
  assert.ok(advanced.every((question) => question.publiclyPublishable === false), `${examId} Advanced Mathematics must keep public release locked.`);

  for (const question of advanced) {
    if (question.slotKind === "ALGEBRA") {
      assert.equal(question.testEligible, false, `${examId} Algebra BANK_ONLY content must not become scored-test eligible.`);
      assert.notEqual(question.packageId, "CAPABILITY_GAP");
    } else {
      assert.equal(question.testEligible, true, `${examId} Trigonometry lost its current internal test eligibility.`);
      assert.ok(question.packageId === "TRG-001" || question.packageId === "TRG-002");
    }
  }

  assert.deepEqual(
    advanced.map((question) => [
      question.ordinal,
      question.slotKind,
      question.packageId,
      question.text,
      question.options,
      question.difficulty,
    ]),
    replayAdvanced.map((question) => [
      question.ordinal,
      question.slotKind,
      question.packageId,
      question.text,
      question.options,
      question.difficulty,
    ]),
    `${examId} Advanced Mathematics integration is not deterministic for an identical section seed.`,
  );
}

const audit = await runQuantV4AdvancedMathRealExamIntegrationAudit({
  sectionsPerProfile: 5,
  seedPrefix: "QUANT-V4-ADVANCED-MATH-INTEGRATION-CI",
});

assert.equal(audit.profilesAudited, 6);
assert.equal(audit.sectionsPerProfile, 5);
for (const summary of audit.summaries) {
  assert.equal(summary.sectionsGenerated, 5);
  assert.ok(summary.advancedMathRecords > 0);
  assert.equal(summary.advancedMathRuntimeGenerated, summary.advancedMathRecords);
  assert.equal(summary.advancedMathCapabilityGaps, 0, `${summary.examId} retained an Advanced Mathematics capability gap.`);
  assert.ok(summary.algebraRecords > 0, `${summary.examId} did not exercise Algebra.`);
  assert.ok(summary.trigonometryRecords > 0, `${summary.examId} did not exercise Trigonometry.`);
  assert.equal(summary.optionMismatchCount, 0, `${summary.examId} Advanced Mathematics option-count drifted.`);

  if (summary.examId === "PSSSB" || summary.examId === "PPSC" || summary.examId === "PUNJAB_POLICE") {
    assert.equal(summary.centralProfileAuthority, "PUNJAB_STATE");
    assert.equal(
      summary.simulatorCentralProfilePropagationPending,
      true,
      `${summary.examId} historical simulator metadata changed; remove this assertion only when its core-slot calls actually pass PUNJAB_STATE.`,
    );
  } else {
    assert.equal(summary.simulatorCentralProfilePropagationPending, false);
  }
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_REAL_EXAM_ADVANCED_MATH_INTEGRATION_P2",
  authority: audit.authority,
  profilesAudited: audit.profilesAudited,
  sectionsPerProfile: audit.sectionsPerProfile,
  advancedMathRecordsByExam: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.advancedMathRecords])),
  advancedMathCapabilityGapsByExam: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.advancedMathCapabilityGaps])),
  centralProfileAuthorityByExam: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.centralProfileAuthority])),
  simulatorCentralProfilePropagationPendingByExam: Object.fromEntries(
    audit.summaries.map((summary) => [summary.examId, summary.simulatorCentralProfilePropagationPending]),
  ),
}));
