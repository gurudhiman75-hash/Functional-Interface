import assert from "node:assert/strict";

import { QUANT_V4_PROFILE_DELIVERY_AUTHORITY } from "../generation-engine";
import { generateQuestion as generateStudioQuestion } from "../question-studio-generation-engine";
import { generateQuestion as generateReviewQuestion } from "../question-studio-review-engine";

export const QUANT_V4_SPECIALIZED_PROFILE_DELIVERY_REMEDIATION_AUTHORITY =
  "QUANT-V4-SPECIALIZED-PROFILE-DELIVERY-REMEDIATION-P2" as const;

function assertDeliveryPending(
  label: string,
  result: any,
  examProfile: string,
  expectedOptionCount: number,
) {
  assert.equal(result?.generationContext?.requestedExamProfile, examProfile, `${label}: requested profile missing from context.`);
  assert.equal(result?.generationContext?.expectedOptionCount, expectedOptionCount, `${label}: central option contract drifted.`);
  assert.equal(
    result?.generationContext?.profileTransportStatus,
    "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
    `${label}: delivery shaping must not claim native exam calibration.`,
  );
  assert.equal(result?.generationContext?.profileSelectionCalibrated, false, `${label}: selection must remain explicitly uncalibrated.`);
  assert.equal(result?.generationContext?.profileDeliveryAuthority, QUANT_V4_PROFILE_DELIVERY_AUTHORITY);
  assert.ok(Array.isArray(result?.questions) && result.questions.length > 0, `${label}: no preview questions returned.`);

  for (const question of result.questions) {
    assert.equal(question.requestedExamProfile, examProfile, `${label}: question request profile missing.`);
    assert.equal(question.deliveryExamProfile, examProfile, `${label}: delivery profile missing.`);
    assert.equal(question.profileSelectionCalibrated, false, `${label}: question falsely claims calibration.`);
    assert.equal(question.deliveryContractApplied, true, `${label}: delivery contract not marked applied.`);
    assert.equal(question.options.length, expectedOptionCount, `${label}: option count mismatch.`);
    assert.equal(new Set(question.options).size, expectedOptionCount, `${label}: options must remain unique.`);
    assert.ok(Number.isInteger(question.correctIndex), `${label}: correctIndex missing.`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < expectedOptionCount, `${label}: correctIndex out of range.`);
  }
}

async function studio(request: Record<string, unknown>) {
  return generateStudioQuestion({ language: "en", count: 2, ...request } as any);
}

async function review(request: Record<string, unknown>) {
  return generateReviewQuestion({ language: "en", count: 2, ...request } as any);
}

const bankingCases = [
  ["AVG", await studio({ packageId: "AVG-001", examProfile: "BANKING_PRELIMS", seed: "profile-delivery:avg:bank" })],
  ["MAL", await studio({ packageId: "MAL-001", examProfile: "BANKING_PRELIMS", seed: "profile-delivery:mal:bank" })],
  ["NUM-standard", await studio({ packageId: "NUM-001", canonicalProblemId: "NUM-CP-003", examProfile: "BANKING_PRELIMS", seed: "profile-delivery:num-standard:bank" })],
  ["NUM-CP001-review", await review({ packageId: "NUM-001", canonicalProblemId: "NUM-CP-001", examProfile: "BANKING_PRELIMS", seed: "profile-delivery:num-cp001:bank" })],
  ["TMW-review", await review({ packageId: "TMW-001", examProfile: "BANKING_PRELIMS", seed: "profile-delivery:tmw:bank" })],
] as const;

for (const [label, result] of bankingCases) {
  assertDeliveryPending(label, result, "BANKING_PRELIMS", 5);
}

const avgPunjab = await studio({
  packageId: "AVG-001",
  examProfile: "PUNJAB_STATE",
  seed: "profile-delivery:avg:punjab",
});
assertDeliveryPending("AVG-Punjab", avgPunjab, "PUNJAB_STATE", 4);

const sapPunjab = await studio({
  packageId: "SAP",
  examProfile: "PUNJAB_STATE",
  seed: "profile-delivery:sap:punjab",
});
assertDeliveryPending("SAP-Punjab-standard", sapPunjab, "PUNJAB_STATE", 4);

const sapBanking = await review({
  packageId: "SAP",
  examProfile: "BANKING_PRELIMS",
  seed: "profile-delivery:sap:native-bank",
});
assert.ok(sapBanking.questions.every((question: any) => question.options.length === 5), "SAP Banking native control must stay five-option.");
assert.ok(
  sapBanking.questions.some((question: any) =>
    question.examProfile === "BANKING_PRELIMS"
    || question.metadata?.examProfile === "BANKING_PRELIMS"
    || question.traceability?.examProfile === "BANKING_PRELIMS"),
  "SAP Banking native control must keep downstream Banking profile evidence.",
);

const deterministicA = await studio({
  packageId: "AVG-001",
  examProfile: "BANKING_PRELIMS",
  seed: "profile-delivery:deterministic",
});
const deterministicB = await studio({
  packageId: "AVG-001",
  examProfile: "BANKING_PRELIMS",
  seed: "profile-delivery:deterministic",
});
assert.deepEqual(
  deterministicA.questions.map((question: any) => ({ options: question.options, correctIndex: question.correctIndex })),
  deterministicB.questions.map((question: any) => ({ options: question.options, correctIndex: question.correctIndex })),
  "Specialized delivery shaping must preserve seeded deterministic replay.",
);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_SPECIALIZED_PROFILE_DELIVERY_REMEDIATION_P2",
  authority: QUANT_V4_SPECIALIZED_PROFILE_DELIVERY_REMEDIATION_AUTHORITY,
  deliveryAuthority: QUANT_V4_PROFILE_DELIVERY_AUTHORITY,
  bankingRemediated: bankingCases.map(([label]) => label),
  punjabStatus: "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
  nativeControl: "SAP_BANKING_PRELIMS",
}));
