import assert from "node:assert/strict";

import { getQuantV4ExamProfileContract } from "../common/exam-profile";
import { generateQuestion as generateStudioQuestion } from "../question-studio-generation-engine";
import { generateQuestion as generateReviewQuestion } from "../question-studio-review-engine";

export const QUANT_V4_SPECIALIZED_PROFILE_BYPASS_MAP_AUTHORITY =
  "QUANT-V4-SPECIALIZED-PROFILE-BYPASS-MAP-P2" as const;

type ProbeStatus =
  | "PROFILE_APPLIED_OR_EXPOSED"
  | "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING"
  | "PROFILE_BYPASS_DELIVERY_MISMATCH";

type Probe = Readonly<{
  id: string;
  engine: "QUESTION_STUDIO_GENERATION" | "QUESTION_STUDIO_REVIEW";
  request: Record<string, unknown>;
}>;

function optionCounts(result: any): number[] {
  return Array.isArray(result?.questions)
    ? result.questions.map((question: any) =>
        Array.isArray(question?.options) ? question.options.length : 0,
      )
    : [];
}

async function runProbe(probe: Probe) {
  const examProfile = String(probe.request.examProfile ?? "");
  const expectedOptionCount = getQuantV4ExamProfileContract(examProfile as any).optionCount;
  const generator = probe.engine === "QUESTION_STUDIO_REVIEW"
    ? generateReviewQuestion
    : generateStudioQuestion;
  const result = await generator(probe.request as any);
  const counts = optionCounts(result);
  assert.ok(counts.length > 0, `${probe.id} returned no preview questions.`);

  const deliveryMatches = counts.every((count) => count === expectedOptionCount);
  const transportStatus = String(result?.generationContext?.profileTransportStatus ?? "");
  const profileSelectionCalibrated = result?.generationContext?.profileSelectionCalibrated === true;
  const nativeProfileProof =
    transportStatus === "APPLIED_DOWNSTREAM" && profileSelectionCalibrated;

  const status: ProbeStatus = nativeProfileProof && deliveryMatches
    ? "PROFILE_APPLIED_OR_EXPOSED"
    : deliveryMatches
      ? "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING"
      : "PROFILE_BYPASS_DELIVERY_MISMATCH";

  return Object.freeze({
    id: probe.id,
    engine: probe.engine,
    packageId: String(probe.request.packageId),
    examProfile,
    expectedOptionCount,
    observedOptionCounts: Object.freeze(counts),
    transportStatus,
    profileSelectionCalibrated,
    nativeProfileProof,
    deliveryMatches,
    status,
  });
}

const probes: readonly Probe[] = Object.freeze([
  {
    id: "AVG_BANKING_PRELIMS",
    engine: "QUESTION_STUDIO_GENERATION",
    request: { packageId: "AVG-001", examProfile: "BANKING_PRELIMS", language: "en", count: 2, seed: "profile-bypass:avg:bank" },
  },
  {
    id: "MAL_BANKING_PRELIMS",
    engine: "QUESTION_STUDIO_GENERATION",
    request: { packageId: "MAL-001", examProfile: "BANKING_PRELIMS", language: "en", count: 2, seed: "profile-bypass:mal:bank" },
  },
  {
    id: "NUM_BANKING_PRELIMS",
    engine: "QUESTION_STUDIO_GENERATION",
    request: { packageId: "NUM-001", examProfile: "BANKING_PRELIMS", language: "en", count: 2, seed: "profile-bypass:num:bank" },
  },
  {
    id: "TMW_BANKING_PRELIMS",
    engine: "QUESTION_STUDIO_REVIEW",
    request: { packageId: "TMW-001", examProfile: "BANKING_PRELIMS", language: "en", count: 2, seed: "profile-bypass:tmw:bank" },
  },
  {
    id: "SAP_BANKING_PRELIMS",
    engine: "QUESTION_STUDIO_REVIEW",
    request: { packageId: "SAP", examProfile: "BANKING_PRELIMS", language: "en", count: 2, seed: "profile-bypass:sap:bank" },
  },
  {
    id: "AVG_PUNJAB_STATE",
    engine: "QUESTION_STUDIO_GENERATION",
    request: { packageId: "AVG-001", examProfile: "PUNJAB_STATE", language: "en", count: 2, seed: "profile-bypass:avg:punjab" },
  },
  {
    id: "SAP_PUNJAB_STATE",
    engine: "QUESTION_STUDIO_GENERATION",
    request: { packageId: "SAP", examProfile: "PUNJAB_STATE", language: "en", count: 2, seed: "profile-bypass:sap:punjab" },
  },
]);

const results = [];
for (const probe of probes) results.push(await runProbe(probe));
const byId = Object.fromEntries(results.map((entry) => [entry.id, entry]));

assert.equal(
  byId.SAP_BANKING_PRELIMS.status,
  "PROFILE_APPLIED_OR_EXPOSED",
  "SAP Banking Speed Maths should remain the positive native specialized-route control.",
);
assert.equal(byId.SAP_BANKING_PRELIMS.expectedOptionCount, 5);
assert.ok(byId.SAP_BANKING_PRELIMS.observedOptionCounts.every((count: number) => count === 5));

for (const id of [
  "AVG_BANKING_PRELIMS",
  "MAL_BANKING_PRELIMS",
  "NUM_BANKING_PRELIMS",
  "TMW_BANKING_PRELIMS",
]) {
  assert.equal(byId[id].expectedOptionCount, 5);
  assert.ok(byId[id].observedOptionCounts.every((count: number) => count === 5), `${id} must deliver five options.`);
  assert.equal(byId[id].status, "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING", `${id} must be delivery-correct without claiming native profile calibration.`);
  assert.equal(byId[id].profileSelectionCalibrated, false);
}

for (const id of ["AVG_PUNJAB_STATE", "SAP_PUNJAB_STATE"]) {
  assert.equal(byId[id].expectedOptionCount, 4);
  assert.ok(byId[id].observedOptionCounts.every((count: number) => count === 4));
  assert.equal(byId[id].status, "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING", `${id} must not be treated as Punjab-calibrated merely because four-option delivery is correct.`);
  assert.equal(byId[id].profileSelectionCalibrated, false);
}

assert.equal(
  results.filter((entry) => entry.status === "PROFILE_BYPASS_DELIVERY_MISMATCH").length,
  0,
  "No probed specialized route may violate its central option-count delivery contract after remediation.",
);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_SPECIALIZED_PROFILE_BYPASS_MAP_P2",
  authority: QUANT_V4_SPECIALIZED_PROFILE_BYPASS_MAP_AUTHORITY,
  results,
}, null, 2));
