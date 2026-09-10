import assert from "node:assert/strict";

import {
  QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
  getQuantV4SpecializedProfileSelectionContract,
  type QuantV4CompetitiveExamProfileId,
  type QuantV4SpecializedSelectionPackageId,
} from "../common/specialized-profile-selection";
import { generateQuestion, listQuantV4Packages } from "../question-studio-review-engine";
import {
  QUANT_V4_PYQ_OBSERVATION_REGISTRY_AUTHORITY,
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import type { QuantV4PyqExamId } from "./quant-v4-pyq-frequency-evidence-p2";

const PACKAGE_IDS = ["AVG-001", "MAL-001", "NUM-001", "TMW-001"] as const satisfies readonly QuantV4SpecializedSelectionPackageId[];
const PROFILE_TO_SOURCE_EXAMS: Readonly<Record<QuantV4CompetitiveExamProfileId, readonly QuantV4PyqExamId[]>> = Object.freeze({
  SSC_CGL_TIER_I: Object.freeze(["SSC_CGL_TIER_I"]),
  SSC_CGL_CHSL: Object.freeze(["SSC_CHSL"]),
  SSC_CGL_JSO: Object.freeze(["SSC_CGL_TIER_II"]),
  PUNJAB_STATE: Object.freeze(["PSSSB", "PPSC", "PUNJAB_POLICE"]),
  BANKING_PRELIMS: Object.freeze(["IBPS_PO_PRELIMS"]),
  BANKING_MAINS: Object.freeze(["IBPS_PO_MAINS"]),
});

assert.equal(
  QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
  "QUANT-V4-SPECIALIZED-PROFILE-SELECTION-EVIDENCE-GATE-P2",
);
assert.equal(
  QUANT_V4_PYQ_OBSERVATION_REGISTRY_AUTHORITY,
  "QUANT-V4-PYQ-OBSERVATION-REGISTRY-P2",
);
assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 10, "The normalized registry should initially contain the ten migrated Algebra observations only.");
assert.ok(
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.every((observation) => observation.packageId === "ALG-001"),
  "A specialized-package observation was added without updating this evidence gate.",
);

for (const packageId of PACKAGE_IDS) {
  for (const [examProfile, examIds] of Object.entries(PROFILE_TO_SOURCE_EXAMS) as [QuantV4CompetitiveExamProfileId, readonly QuantV4PyqExamId[]][]) {
    const countable = listRegisteredCountablePyqObservations({ packageId, examIds });
    assert.equal(
      countable.length,
      0,
      `${packageId}/${examProfile} now has normalized countable PYQ evidence; review and replace the evidence gate deliberately before claiming profile selection.`,
    );
    const contract = getQuantV4SpecializedProfileSelectionContract(packageId, examProfile);
    assert.equal(contract.normalizedCountableObservationCount, 0);
    assert.equal(contract.selectionStatus, "EVIDENCE_GATED_SELECTION_PENDING");
    assert.equal(contract.profileSelectionCalibrated, false);
    assert.equal(contract.deliveryAllowed, true);
    assert.deepEqual(contract.blockers, [
      "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE",
      "CP_QL_DISTRIBUTION_UNPROVEN",
      "DIFFICULTY_REPRESENTATION_UNCALIBRATED",
    ]);
  }
}

const packages = listQuantV4Packages();
for (const packageId of PACKAGE_IDS) {
  const pkg = packages.find((entry: any) => entry.packageId === packageId) as any;
  assert.ok(pkg, `${packageId} is missing from Question Studio capabilities.`);
  assert.equal(pkg.examProfileSelection?.authority, QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY);
  assert.equal(pkg.examProfileSelection?.defaultSelectionStatus, "EVIDENCE_GATED_SELECTION_PENDING");
  assert.equal(pkg.examProfileSelection?.profileSelectionCalibrated, false);
  assert.equal(pkg.examProfileSelection?.deliveryAllowed, true);
  for (const examProfile of Object.keys(PROFILE_TO_SOURCE_EXAMS) as QuantV4CompetitiveExamProfileId[]) {
    assert.equal(
      pkg.examProfileSelection?.competitiveProfiles?.[examProfile]?.selectionStatus,
      "EVIDENCE_GATED_SELECTION_PENDING",
      `${packageId}/${examProfile} capability must expose the evidence gate.`,
    );
  }
}

const runtimeCases = [
  { packageId: "AVG-001", examProfile: "BANKING_PRELIMS", seed: "selection-gate:avg:bank" },
  { packageId: "MAL-001", examProfile: "BANKING_PRELIMS", seed: "selection-gate:mal:bank" },
  { packageId: "NUM-001", examProfile: "BANKING_PRELIMS", canonicalProblemId: "NUM-CP-003", seed: "selection-gate:num:bank" },
  { packageId: "TMW-001", examProfile: "BANKING_PRELIMS", seed: "selection-gate:tmw:bank" },
  { packageId: "AVG-001", examProfile: "PUNJAB_STATE", seed: "selection-gate:avg:punjab" },
  { packageId: "TMW-001", examProfile: "PUNJAB_STATE", seed: "selection-gate:tmw:punjab" },
] as const;

for (const request of runtimeCases) {
  const result = await generateQuestion({ ...request, language: "en", count: 1 } as any);
  assert.equal(
    result.generationContext?.profileTransportStatus,
    "DELIVERY_CONTRACT_APPLIED_SELECTION_PENDING",
    `${request.packageId}/${request.examProfile} must remain delivery-correct but selection-pending.`,
  );
  assert.equal(result.generationContext?.profileSelectionCalibrated, false);
  const expectedOptions = request.examProfile === "BANKING_PRELIMS" ? 5 : 4;
  assert.equal(result.questions[0]?.options?.length, expectedOptions);
}

const sapBanking = await generateQuestion({
  packageId: "SAP",
  examProfile: "BANKING_PRELIMS",
  language: "en",
  count: 1,
  seed: "selection-gate:sap:native-control",
} as any);
assert.equal(sapBanking.questions[0]?.examProfile, "BANKING_PRELIMS");
assert.equal(sapBanking.questions[0]?.options?.length, 5);
assert.equal(sapBanking.generationContext?.runtimeMode, "SAP_BANKING_SPEED_PROFILE_V1");

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_SPECIALIZED_PROFILE_SELECTION_EVIDENCE_GATE_P2",
  authority: QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
  registryAuthority: QUANT_V4_PYQ_OBSERVATION_REGISTRY_AUTHORITY,
  registeredCountableObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  specializedPackages: [...PACKAGE_IDS],
  promotedProfiles: 0,
  nativeControl: "SAP/BANKING_PRELIMS",
}));
