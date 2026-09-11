import assert from "node:assert/strict";

import {
  QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
  QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS,
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

const PACKAGE_IDS = ["AVG-001", "MAL-001", "NUM-001", "TMW-001"] as const satisfies readonly QuantV4SpecializedSelectionPackageId[];

assert.equal(
  QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
  "QUANT-V4-SPECIALIZED-PROFILE-SELECTION-EVIDENCE-GATE-P2",
);
assert.equal(
  QUANT_V4_PYQ_OBSERVATION_REGISTRY_AUTHORITY,
  "QUANT-V4-PYQ-OBSERVATION-REGISTRY-P2",
);
assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 108, "The normalized registry should contain two complete dated SSC CGL Tier-I Quant sections plus prior evidence.");
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-001" }).length, 15);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-002" }).length, 11);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "AVG-001" }).length, 7);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "NUM-001" }).length, 18);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PNL-001" }).length, 4);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TMW-001" }).length, 11);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TSD-001" }).length, 6);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TSD-002" }).length, 3);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PCT-002" }).length, 6);

const ZERO_COUNTS: Readonly<Record<QuantV4CompetitiveExamProfileId, number>> = Object.freeze({
  SSC_CGL_TIER_I: 0,
  SSC_CGL_CHSL: 0,
  SSC_CGL_JSO: 0,
  PUNJAB_STATE: 0,
  BANKING_PRELIMS: 0,
  BANKING_MAINS: 0,
});

const EXPECTED_COUNTS: Readonly<Record<QuantV4SpecializedSelectionPackageId, Readonly<Record<QuantV4CompetitiveExamProfileId, number>>>> = Object.freeze({
  "AVG-001": Object.freeze({ ...ZERO_COUNTS, SSC_CGL_TIER_I: 1, SSC_CGL_CHSL: 6 }),
  "MAL-001": ZERO_COUNTS,
  "NUM-001": Object.freeze({
    SSC_CGL_TIER_I: 12,
    SSC_CGL_CHSL: 5,
    SSC_CGL_JSO: 1,
    PUNJAB_STATE: 0,
    BANKING_PRELIMS: 0,
    BANKING_MAINS: 0,
  }),
  "TMW-001": Object.freeze({ ...ZERO_COUNTS, SSC_CGL_TIER_I: 6, SSC_CGL_CHSL: 5 }),
});

for (const packageId of PACKAGE_IDS) {
  for (const [examProfile, examIds] of Object.entries(QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS) as [QuantV4CompetitiveExamProfileId, readonly any[]][]) {
    const countable = listRegisteredCountablePyqObservations({ packageId, examIds });
    const contract = getQuantV4SpecializedProfileSelectionContract(packageId, examProfile);
    const expectedCount = EXPECTED_COUNTS[packageId][examProfile];

    assert.equal(countable.length, expectedCount, `${packageId}/${examProfile} normalized evidence count drifted.`);
    assert.equal(contract.normalizedCountableObservationCount, expectedCount);
    assert.equal(contract.profileSelectionCalibrated, false);
    assert.equal(contract.deliveryAllowed, true);

    if (expectedCount > 0) {
      assert.equal(contract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
      assert.equal(contract.empiricalEvidenceStatus, "NORMALIZED_COUNTABLE_EVIDENCE_ACCUMULATING");
      assert.ok(!contract.blockers.includes("NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE"));
      assert.ok(contract.blockers.includes("PROFILE_SAMPLE_INSUFFICIENT_FOR_CALIBRATION"));
      assert.ok(contract.blockers.includes("CP_QL_DISTRIBUTION_UNPROVEN"));
      assert.ok(contract.blockers.includes("DIFFICULTY_REPRESENTATION_UNCALIBRATED"));
      const datedIdentityIncomplete = countable.some((observation) => !observation.heldDate || !observation.shift);
      assert.equal(
        contract.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"),
        datedIdentityIncomplete,
        `${packageId}/${examProfile} dated-identity blocker must follow its normalized observations.`,
      );
    } else {
      assert.equal(contract.selectionStatus, "EVIDENCE_GATED_SELECTION_PENDING");
      assert.equal(contract.empiricalEvidenceStatus, "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE");
      assert.deepEqual(contract.blockers, [
        "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE",
        "CP_QL_DISTRIBUTION_UNPROVEN",
        "DIFFICULTY_REPRESENTATION_UNCALIBRATED",
      ]);
    }
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

  const totalExpected = Object.values(EXPECTED_COUNTS[packageId]).reduce((sum, value) => sum + value, 0);
  const expectedEvidenceProfiles = Object.values(EXPECTED_COUNTS[packageId]).filter((value) => value > 0).length;
  assert.equal(pkg.examProfileSelection?.normalizedCountableObservationCount, totalExpected);
  assert.equal(pkg.examProfileSelection?.evidenceBearingProfileCount, expectedEvidenceProfiles);

  for (const examProfile of Object.keys(QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS) as QuantV4CompetitiveExamProfileId[]) {
    const expectedStatus = EXPECTED_COUNTS[packageId][examProfile] > 0
      ? "EVIDENCE_ACCUMULATING_SELECTION_PENDING"
      : "EVIDENCE_GATED_SELECTION_PENDING";
    assert.equal(
      pkg.examProfileSelection?.competitiveProfiles?.[examProfile]?.selectionStatus,
      expectedStatus,
      `${packageId}/${examProfile} capability must expose its truthful evidence state.`,
    );
  }
}

const runtimeCases = [
  { packageId: "AVG-001", examProfile: "SSC_CGL_TIER_I", seed: "selection-gate:avg:ssc-tier1" },
  { packageId: "AVG-001", examProfile: "SSC_CGL_CHSL", seed: "selection-gate:avg:chsl" },
  { packageId: "AVG-001", examProfile: "BANKING_PRELIMS", seed: "selection-gate:avg:bank" },
  { packageId: "MAL-001", examProfile: "BANKING_PRELIMS", seed: "selection-gate:mal:bank" },
  { packageId: "NUM-001", examProfile: "BANKING_PRELIMS", canonicalProblemId: "NUM-CP-003", seed: "selection-gate:num:bank" },
  { packageId: "NUM-001", examProfile: "SSC_CGL_TIER_I", canonicalProblemId: "NUM-CP-003", seed: "selection-gate:num:ssc-tier1" },
  { packageId: "NUM-001", examProfile: "SSC_CGL_CHSL", canonicalProblemId: "NUM-CP-003", seed: "selection-gate:num:chsl" },
  { packageId: "NUM-001", examProfile: "SSC_CGL_JSO", canonicalProblemId: "NUM-CP-003", seed: "selection-gate:num:jso" },
  { packageId: "TMW-001", examProfile: "SSC_CGL_TIER_I", seed: "selection-gate:tmw:ssc-tier1" },
  { packageId: "TMW-001", examProfile: "SSC_CGL_CHSL", seed: "selection-gate:tmw:chsl" },
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
  evidenceAccumulatingProfiles: [
    "AVG-001/SSC_CGL_TIER_I",
    "AVG-001/SSC_CGL_CHSL",
    "NUM-001/SSC_CGL_TIER_I",
    "NUM-001/SSC_CGL_CHSL",
    "NUM-001/SSC_CGL_JSO",
    "TMW-001/SSC_CGL_TIER_I",
    "TMW-001/SSC_CGL_CHSL",
  ],
  nativeControl: "SAP/BANKING_PRELIMS",
}));
