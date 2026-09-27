import assert from "node:assert/strict";

import {
  QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
  getQuantV4SpecializedProfileSelectionContract,
  type QuantV4SpecializedSelectionPackageId,
} from "../common/specialized-profile-selection";

const packages: readonly QuantV4SpecializedSelectionPackageId[] = [
  "AVG-001",
  "MAL-001",
  "NUM-001",
  "TMW-001",
];

assert.equal(
  QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
  "QUANT-V4-SPECIALIZED-PROFILE-SELECTION-EVIDENCE-GATE-P2",
);

const contracts = packages.map((packageId) =>
  getQuantV4SpecializedProfileSelectionContract(packageId, "PUNJAB_STATE"),
);

for (const contract of contracts) {
  assert.equal(contract.examProfile, "PUNJAB_STATE");
  assert.equal(contract.deliveryAllowed, true, `${contract.packageId} Punjab delivery must remain available.`);
  assert.equal(contract.profileSelectionCalibrated, false, `${contract.packageId} must not claim Punjab selection calibration without evidence.`);
  assert.equal(
    contract.normalizedCountableObservationCount,
    0,
    `${contract.packageId} gained normalized Punjab evidence; review and deliberately replace this evidence gate before enabling Punjab selection.`,
  );
  assert.equal(contract.empiricalEvidenceStatus, "NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE");
  assert.equal(contract.selectionStatus, "EVIDENCE_GATED_SELECTION_PENDING");
  assert.ok(contract.blockers.includes("NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE"));
  assert.ok(contract.blockers.includes("CP_QL_DISTRIBUTION_UNPROVEN"));
  assert.ok(contract.blockers.includes("DIFFICULTY_REPRESENTATION_UNCALIBRATED"));
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_PUNJAB_SPECIALIZED_SELECTION_EVIDENCE_GATE_P2",
  authority: QUANT_V4_SPECIALIZED_PROFILE_SELECTION_AUTHORITY,
  examProfile: "PUNJAB_STATE",
  packageCount: contracts.length,
  packages: Object.fromEntries(contracts.map((contract) => [
    contract.packageId,
    {
      deliveryAllowed: contract.deliveryAllowed,
      profileSelectionCalibrated: contract.profileSelectionCalibrated,
      normalizedCountableObservationCount: contract.normalizedCountableObservationCount,
      selectionStatus: contract.selectionStatus,
      blockers: contract.blockers,
    },
  ])),
}));
