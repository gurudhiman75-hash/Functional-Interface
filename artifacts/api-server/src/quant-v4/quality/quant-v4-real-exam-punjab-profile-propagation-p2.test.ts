import assert from "node:assert/strict";

import { getQuantV4ExamProfileContract } from "../common/exam-profile";
import {
  QUANT_V4_PUNJAB_SIMULATION_EXAMS,
  QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
  generateQuantV4PunjabRealExamSection,
  runQuantV4PunjabProfilePropagationAudit,
} from "./quant-v4-real-exam-punjab-profile-propagation-p2";
import { QUANT_V4_REAL_EXAM_PROFILES } from "./quant-v4-real-exam-simulation-p2";

const central = getQuantV4ExamProfileContract("PUNJAB_STATE");
assert.equal(central.family, "PUNJAB_STATE");
assert.equal(central.deliveryStyle, "PUNJAB_STATE_OBJECTIVE");
assert.equal(central.optionCount, 4);
assert.equal(
  QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY,
  "QUANT-V4-REAL-EXAM-PUNJAB-PROFILE-PROPAGATION-P2",
);

for (const examId of QUANT_V4_PUNJAB_SIMULATION_EXAMS) {
  const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === examId)!;
  const expectedCoreCount = profile.slotPlan
    .filter((slot) => slot.kind === "ARITHMETIC_CORE" || slot.kind === "GEOMETRY_MENSURATION")
    .reduce((total, slot) => total + slot.count, 0);
  const seed = `QUANT-V4-PUNJAB-PROFILE-PROPAGATION-PROBE:${examId}`;
  const first = await generateQuantV4PunjabRealExamSection({ examId, sectionIndex: 1, seed });
  const replay = await generateQuantV4PunjabRealExamSection({ examId, sectionIndex: 1, seed });

  assert.equal(first.resolvedCentralDeliveryProfile, "PUNJAB_STATE");
  assert.equal(first.profilePropagationAuthority, QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY);
  assert.equal(first.questions.length, profile.questionCount);

  const core = first.questions.filter((question) =>
    question.slotKind === "ARITHMETIC_CORE" || question.slotKind === "GEOMETRY_MENSURATION",
  );
  const replayCore = replay.questions.filter((question) =>
    question.slotKind === "ARITHMETIC_CORE" || question.slotKind === "GEOMETRY_MENSURATION",
  );
  assert.equal(core.length, expectedCoreCount, `${examId} core-slot count drifted.`);
  assert.equal(first.coreProfileReplacements, expectedCoreCount, `${examId} did not pass every core slot through Punjab profile propagation.`);
  assert.ok(core.every((question) => question.sourceKind === "RUNTIME_GENERATED"), `${examId} retained a Punjab core capability gap.`);
  assert.ok(core.every((question) => question.requestedDeliveryProfile === "PUNJAB_STATE"));
  assert.ok(core.every((question) => question.deliveryProfileApplied === true));
  assert.ok(core.every((question) => question.profilePropagationAuthority === QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_AUTHORITY));
  assert.ok(core.every((question) => question.optionCount === 4));
  assert.ok(core.every((question) => question.options.length === 4 && new Set(question.options).size === 4));
  assert.ok(core.every((question) => question.text.trim().length > 0));
  assert.ok(core.every((question) => question.explanation.trim().length > 0));

  assert.deepEqual(
    core.map((question) => [
      question.ordinal,
      question.slotKind,
      question.packageId,
      question.text,
      question.options,
      question.difficulty,
      question.requestedDeliveryProfile,
    ]),
    replayCore.map((question) => [
      question.ordinal,
      question.slotKind,
      question.packageId,
      question.text,
      question.options,
      question.difficulty,
      question.requestedDeliveryProfile,
    ]),
    `${examId} Punjab core profile propagation is not deterministic for the same seed.`,
  );

  const advanced = first.questions.filter((question) =>
    question.slotKind === "ALGEBRA" || question.slotKind === "TRIGONOMETRY",
  );
  assert.ok(advanced.length > 0);
  assert.ok(advanced.every((question) => question.sourceKind === "RUNTIME_GENERATED"), `${examId} regressed the merged Advanced Mathematics integration.`);
}

const audit = await runQuantV4PunjabProfilePropagationAudit({
  sectionsPerProfile: 2,
  seedPrefix: "QUANT-V4-PUNJAB-PROFILE-PROPAGATION-CI",
});
assert.equal(audit.profilesAudited, 3);
assert.equal(audit.sectionsPerProfile, 2);
assert.equal(audit.resolvedCentralDeliveryProfile, "PUNJAB_STATE");

for (const summary of audit.summaries) {
  assert.equal(summary.sectionsGenerated, 2);
  assert.ok(summary.coreRecords > 0);
  assert.equal(summary.coreRuntimeGenerated, summary.coreRecords, `${summary.examId} has a Punjab core runtime gap.`);
  assert.equal(summary.coreProfileApplied, summary.coreRecords, `${summary.examId} has a core slot without explicit PUNJAB_STATE delivery.`);
  assert.equal(summary.coreCapabilityGaps, 0, `${summary.examId} has a Punjab profile capability gap.`);
  assert.equal(summary.optionMismatchCount, 0, `${summary.examId} Punjab core delivery is not four-option.`);
  assert.equal(summary.historicalSimulatorMetadataStillStale, true, `${summary.examId} historical baseline metadata changed; retire this assertion only when the baseline file itself is consolidated.`);
  assert.equal(summary.packageDistribution.CAPABILITY_GAP ?? 0, 0);
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_REAL_EXAM_PUNJAB_PROFILE_PROPAGATION_P2",
  authority: audit.authority,
  profilesAudited: audit.profilesAudited,
  sectionsPerProfile: audit.sectionsPerProfile,
  resolvedCentralDeliveryProfile: audit.resolvedCentralDeliveryProfile,
  summaries: audit.summaries,
}));
