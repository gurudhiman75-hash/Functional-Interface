import assert from "node:assert/strict";

import {
  QUANT_V4_REAL_EXAM_PROFILES,
  generateQuantV4RealExamSection,
  resolveProbabilitySimulationProfile,
} from "./quant-v4-real-exam-simulation-p2";

const PUNJAB_EXAMS = ["PSSSB", "PPSC", "PUNJAB_POLICE"] as const;

for (const examId of PUNJAB_EXAMS) {
  const profile = QUANT_V4_REAL_EXAM_PROFILES.find((entry) => entry.id === examId);
  assert.ok(profile, `Missing real-exam profile ${examId}.`);
  assert.equal(resolveProbabilitySimulationProfile(profile), "PUNJAB_STATE");

  const section = await generateQuantV4RealExamSection({
    examId,
    sectionIndex: 3,
    seed: `QUANT-V4-PROBABILITY-PUNJAB-DIRECT-PROFILE-P2:${examId}`,
  });
  const expected = profile.slotPlan.find((slot) => slot.kind === "PROBABILITY")?.count ?? 0;
  const probability = section.questions.filter((question) => question.slotKind === "PROBABILITY");

  assert.ok(expected > 0, `${examId} must exercise Probability in its simulation blueprint.`);
  assert.equal(probability.length, expected);
  assert.ok(probability.every((question) => question.sourceKind === "CAPABILITY_GAP"));
  assert.ok(
    probability.every((question) =>
      /PUNJAB_STATE Probability generation is evidence-gated/u.test(question.gapReason ?? ""),
    ),
    `${examId} Probability must fail through the explicit Punjab evidence gate.`,
  );
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_PROBABILITY_PUNJAB_SIMULATOR_DIRECT_PROFILE_P2",
  exams: PUNJAB_EXAMS,
  resolvedProfile: "PUNJAB_STATE",
  runtimeOutcome: "EVIDENCE_GATED_CAPABILITY_GAP",
}));
