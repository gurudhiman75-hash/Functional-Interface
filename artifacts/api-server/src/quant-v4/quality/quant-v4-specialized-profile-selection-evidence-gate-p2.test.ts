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
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";

const PACKAGE_IDS = ["AVG-001", "MAL-001", "NUM-001", "TMW-001"] as const satisfies readonly QuantV4SpecializedSelectionPackageId[];
const EXAM_PROFILES = Object.keys(QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS) as QuantV4CompetitiveExamProfileId[];

assert.equal(QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY, "QUANT-V4-SPECIALIZED-PROFILE-SELECTION-EVIDENCE-GATE-P2");
assert.equal(QUANT_V4_PYQ_OBSERVATION_REGISTRY_AUTHORITY, "QUANT-V4-PYQ-OBSERVATION-REGISTRY-P2");

// This gate intentionally follows the live normalized registry. Historical evidence waves
// may add observations; selection-policy behavior must remain correct without freezing the
// registry at the totals that existed when this test was first authored.
const liveCounts = new Map<string, number>();
for (const packageId of PACKAGE_IDS) {
  for (const examProfile of EXAM_PROFILES) {
    const examIds = QUANT_V4_SPECIALIZED_PROFILE_SOURCE_EXAMS[examProfile];
    const countable = listRegisteredCountablePyqObservations({ packageId, examIds });
    const contract = getQuantV4SpecializedProfileSelectionContract(packageId, examProfile);
    const expectedCount = countable.length;
    liveCounts.set(`${packageId}:${examProfile}`, expectedCount);

    assert.equal(contract.normalizedCountableObservationCount, expectedCount, `${packageId}/${examProfile} contract must follow live normalized evidence.`);
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

  const profileCounts = EXAM_PROFILES.map((examProfile) => liveCounts.get(`${packageId}:${examProfile}`) ?? 0);
  const totalExpected = profileCounts.reduce((sum, value) => sum + value, 0);
  const expectedEvidenceProfiles = profileCounts.filter((value) => value > 0).length;
  assert.equal(pkg.examProfileSelection?.normalizedCountableObservationCount, totalExpected);
  assert.equal(pkg.examProfileSelection?.evidenceBearingProfileCount, expectedEvidenceProfiles);

  for (const examProfile of EXAM_PROFILES) {
    const expectedCount = liveCounts.get(`${packageId}:${examProfile}`) ?? 0;
    const expectedStatus = expectedCount > 0
      ? "EVIDENCE_ACCUMULATING_SELECTION_PENDING"
      : "EVIDENCE_GATED_SELECTION_PENDING";
    assert.equal(
      pkg.examProfileSelection?.competitiveProfiles?.[examProfile]?.selectionStatus,
      expectedStatus,
      `${packageId}/${examProfile} capability must expose its truthful live evidence state.`,
    );
  }
}

const runtimeCases = [
  { packageId: "AVG-001", examProfile: "SSC_CGL_TIER_I", seed: "selection-gate:avg:ssc-tier1" },
  { packageId: "AVG-001", examProfile: "SSC_CGL_CHSL", seed: "selection-gate:avg:chsl" },
  { packageId: "AVG-001", examProfile: "BANKING_PRELIMS", seed: "selection-gate:avg:bank" },
  { packageId: "MAL-001", examProfile: "SSC_CGL_TIER_I", seed: "selection-gate:mal:ssc-tier1" },
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
  specializedPackages: [...PACKAGE_IDS],
  promotedProfiles: 0,
  evidenceAccumulatingProfileCount: [...liveCounts.values()].filter((count) => count > 0).length,
  nativeControl: "SAP/BANKING_PRELIMS",
}));
