import assert from "node:assert/strict";

import {
  QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE,
  QUANT_V4_REAL_EXAM_PROFILES,
  QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY,
  generateQuantV4RealExamSection,
  runQuantV4RealExamSimulationAudit,
} from "./quant-v4-real-exam-simulation-p2";

assert.equal(QUANT_V4_REAL_EXAM_SIMULATION_AUTHORITY, "QUANT-V4-REAL-EXAM-SIMULATION-AUDIT-P2");
assert.equal(QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE, 20);
assert.equal(QUANT_V4_REAL_EXAM_PROFILES.length, 11, "The audit must cover all 11 exam families named in the Quant V4 audit plan.");
assert.equal(new Set(QUANT_V4_REAL_EXAM_PROFILES.map((profile) => profile.id)).size, 11, "Real-exam profile ids must be unique.");

for (const profile of QUANT_V4_REAL_EXAM_PROFILES) {
  assert.equal(
    profile.slotPlan.reduce((sum, slot) => sum + slot.count, 0),
    profile.questionCount,
    `${profile.id} slot plan does not fill its full simulated section.`,
  );
  assert.ok(profile.sectionsPerAudit >= 20 && profile.sectionsPerAudit <= 100, `${profile.id} must simulate 20-100 complete sections.`);
  assert.equal(profile.expectedOptionCount, profile.family === "BANKING" ? 5 : 4, `${profile.id} delivery option count drifted.`);
  assert.equal(profile.blueprintEvidence, "PROVISIONAL_PYQ_WEIGHTING_REQUIRED", `${profile.id} must not pretend provisional topic weights are empirically frozen.`);
}

const punjabProfiles = QUANT_V4_REAL_EXAM_PROFILES.filter((profile) => profile.family === "PUNJAB_STATE");
assert.equal(punjabProfiles.length, 3);
for (const profile of punjabProfiles) {
  assert.equal(profile.centralProfileGap, true, `${profile.id} must remain explicit about the missing central Punjab Quant profile.`);
  assert.equal(profile.centralDeliveryProfile, null, `${profile.id} must not silently masquerade as an SSC central profile.`);
}

const structuralProbeIds = [
  "SSC_CGL_TIER_I",
  "PSSSB",
  "IBPS_PO_PRELIMS",
  "IBPS_PO_MAINS",
] as const;
for (const examId of structuralProbeIds) {
  const section = await generateQuantV4RealExamSection({
    examId,
    sectionIndex: 1,
    seed: `QUANT-V4-REAL-EXAM-STRUCTURAL-PROBE:${examId}`,
  });
  const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === examId)!;
  assert.equal(section.questions.length, profile.questionCount, `${examId} structural probe is not a full section manifest.`);
  assert.equal(section.expectedOptionCount, profile.expectedOptionCount);
  assert.deepEqual(
    section.questions.map((question) => question.ordinal),
    Array.from({ length: profile.questionCount }, (_, index) => index + 1),
    `${examId} section ordinals must be contiguous.`,
  );
  assert.ok(section.questions.some((question) => question.sourceKind === "RUNTIME_GENERATED"), `${examId} did not exercise live generation.`);
}

const audit = await runQuantV4RealExamSimulationAudit({
  sectionsPerProfile: QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE,
  seedPrefix: "QUANT-V4-REAL-EXAM-SIMULATION-CI",
});

assert.equal(audit.profilesAudited, 11);
assert.equal(audit.sectionsPerProfile, 20);
assert.equal(audit.totalSections, 220, "The minimum audit must generate 20 sections for each of 11 profiles.");

const expectedRecords = QUANT_V4_REAL_EXAM_PROFILES.reduce(
  (sum, profile) => sum + profile.questionCount * audit.sectionsPerProfile,
  0,
);
assert.equal(
  audit.summaries.reduce((sum, summary) => sum + summary.recordsGenerated, 0),
  expectedRecords,
  "The audit must account for every slot in every simulated section, including explicit capability gaps.",
);

for (const summary of audit.summaries) {
  const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === summary.examId)!;
  assert.equal(summary.sectionsGenerated, 20, `${summary.examId} did not complete the minimum 20-section simulation.`);
  assert.equal(summary.questionsExpected, profile.questionCount * 20);
  assert.equal(summary.recordsGenerated, summary.questionsExpected);
  assert.equal(summary.runtimeGeneratedCount + summary.capabilityGapCount, summary.recordsGenerated);
  assert.ok(summary.runtimeGeneratedCount > 0, `${summary.examId} did not generate any real runtime questions.`);
  assert.ok(Number.isFinite(summary.averageStemWords));
  assert.ok(Number.isFinite(summary.averageExplanationWords));
  assert.ok(summary.explanationSpecificityRate >= 0 && summary.explanationSpecificityRate <= 1);
  assert.ok(summary.exactStemDuplicateRate >= 0 && summary.exactStemDuplicateRate <= 1);
  assert.ok(summary.semanticExplanationDuplicateRate >= 0 && summary.semanticExplanationDuplicateRate <= 1);
  assert.equal(summary.readiness, "EXAM_SIMULATION_NOT_READY", `${summary.examId} must stay NOT_READY while PYQ frequency weighting is provisional.`);
  assert.ok(summary.blockers.includes("PYQ_FREQUENCY_WEIGHTING_PENDING"), `${summary.examId} lost the empirical-weighting blocker.`);

  if (profile.family === "PUNJAB_STATE") {
    assert.equal(summary.centralProfileGap, true);
    assert.ok(summary.blockers.includes("CENTRAL_EXAM_PROFILE_MISSING"));
  }
  if (profile.family === "BANKING") {
    assert.ok(summary.diSetCount > 0, `${summary.examId} did not exercise linked DI sets.`);
    assert.ok((summary.representationDistribution.DATA_INTERPRETATION ?? 0) === 0, "DI must report its concrete table/bar/line/pie/caselet representation rather than a generic label.");
  }
}

for (const examId of ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II", "SSC_CHSL", "PSSSB", "PPSC", "PUNJAB_POLICE"] as const) {
  const summary = audit.summaries.find((entry) => entry.examId === examId)!;
  assert.ok(summary.capabilityGapCount > 0, `${examId} unexpectedly hid the current Algebra/Trigonometry section-assembly gap.`);
  assert.ok(summary.blockers.includes("CAPABILITY_GAPS_PRESENT"));
}

const bankingSummaries = audit.summaries.filter((entry) =>
  ["IBPS_PO_PRELIMS", "IBPS_PO_MAINS", "IBPS_CLERK", "SBI_PO", "IBPS_RRB_BANKING"].includes(entry.examId),
);
assert.equal(bankingSummaries.length, 5);
assert.ok(
  bankingSummaries.reduce((sum, summary) => sum + summary.runtimeGeneratedCount, 0) > 2000,
  "Banking simulation should exercise a substantial live runtime surface rather than only blueprint metadata.",
);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_REAL_EXAM_SIMULATION_AUDIT_P2",
  authority: audit.authority,
  profilesAudited: audit.profilesAudited,
  sectionsPerProfile: audit.sectionsPerProfile,
  totalSections: audit.totalSections,
  totalRecords: expectedRecords,
  readiness: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.readiness])),
  runtimeGeneratedByExam: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.runtimeGeneratedCount])),
  capabilityGapsByExam: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.capabilityGapCount])),
  optionMismatchByExam: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.optionMismatchCount])),
  diSetsByExam: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.diSetCount])),
  blockersByExam: Object.fromEntries(audit.summaries.map((summary) => [summary.examId, summary.blockers])),
}));
