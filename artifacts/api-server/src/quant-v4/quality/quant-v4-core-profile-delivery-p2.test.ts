import assert from "node:assert/strict";

import {
  QUANT_V4_PROFILE_DELIVERY_AUTHORITY,
  generateQuestion,
} from "../generation-engine";

const cases = [
  { profile: "PUNJAB_STATE", expectedOptions: 4 },
  { profile: "SSC_CGL_TIER_I", expectedOptions: 4 },
  { profile: "BANKING_PRELIMS", expectedOptions: 5 },
  { profile: "BANKING_MAINS", expectedOptions: 5 },
] as const;

for (const testCase of cases) {
  const seed = `quant-v4-core-profile-delivery:${testCase.profile}`;
  const first = await generateQuestion({
    packageId: "PCT-001",
    examProfile: testCase.profile,
    count: 4,
    seed,
  });
  const replay = await generateQuestion({
    packageId: "PCT-001",
    examProfile: testCase.profile,
    count: 4,
    seed,
  });

  assert.equal(
    first.generationContext.profileTransportStatus,
    "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
    `${testCase.profile} must distinguish delivery application from profile-specific content calibration.`,
  );
  assert.equal(first.generationContext.profileSelectionCalibrated, false);
  assert.equal(first.generationContext.deliveryAppliedCount, 4);
  assert.equal(first.generationContext.downstreamPendingCount, 0);
  assert.equal(first.generationContext.expectedOptionCount, testCase.expectedOptions);
  assert.equal(first.generationContext.profileDeliveryAuthority, QUANT_V4_PROFILE_DELIVERY_AUTHORITY);

  assert.equal(first.questions.length, 4);
  for (const question of first.questions) {
    assert.equal(question.examProfileTransportStatus, "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING");
    assert.equal(question.deliveryContractApplied, true);
    assert.equal(question.profileSelectionCalibrated, false);
    assert.equal(question.deliveryExamProfile, testCase.profile);
    assert.equal(question.requestedExamProfile, testCase.profile);
    assert.equal(question.optionCount, testCase.expectedOptions);
    assert.equal(question.options.length, testCase.expectedOptions);
    assert.equal(new Set(question.options).size, testCase.expectedOptions);
    assert.ok(Number.isInteger(question.correctIndex));
    assert.ok(question.correctIndex >= 0 && question.correctIndex < testCase.expectedOptions);
    assert.equal(question.correct, question.correctIndex);
    assert.equal(question.profileDeliveryAuthority, QUANT_V4_PROFILE_DELIVERY_AUTHORITY);
  }

  assert.deepEqual(
    first.questions.map((question: any) => [
      question.questionId,
      question.text,
      question.options,
      question.correctIndex,
      question.answer,
      question.deliveryExamProfile,
    ]),
    replay.questions.map((question: any) => [
      question.questionId,
      question.text,
      question.options,
      question.correctIndex,
      question.answer,
      question.deliveryExamProfile,
    ]),
    `${testCase.profile} public delivery shaping must be deterministic.`,
  );
}

const noProfile = await generateQuestion({
  packageId: "PCT-001",
  count: 2,
  seed: "quant-v4-core-profile-delivery:no-profile",
});
assert.equal(noProfile.generationContext?.requestedExamProfile, undefined);
assert.ok(noProfile.questions.every((question: any) => question.deliveryContractApplied === undefined));

const probability = await generateQuestion({
  packageId: "PRB-001" as any,
  canonicalProblemId: "PRB-CP-001",
  examProfile: "BANKING_PRELIMS",
  count: 3,
  seed: "quant-v4-core-profile-delivery:probability-native",
});
assert.equal(probability.generationContext.profileTransportStatus, "APPLIED_DOWNSTREAM");
assert.equal(probability.generationContext.profileSelectionCalibrated, true);
assert.equal(probability.generationContext.downstreamAppliedCount, 3);
assert.equal(probability.generationContext.deliveryAppliedCount, 0);
assert.ok(probability.questions.every((question: any) => question.options.length === 5));
assert.ok(probability.questions.every((question: any) => question.examProfileTransportStatus === "APPLIED_DOWNSTREAM"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CORE_PROFILE_DELIVERY_P2",
  authority: QUANT_V4_PROFILE_DELIVERY_AUTHORITY,
  coreProfilesChecked: cases.map((entry) => entry.profile),
  coreDeliveryState: "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
  nativeProbabilityState: probability.generationContext.profileTransportStatus,
}));
