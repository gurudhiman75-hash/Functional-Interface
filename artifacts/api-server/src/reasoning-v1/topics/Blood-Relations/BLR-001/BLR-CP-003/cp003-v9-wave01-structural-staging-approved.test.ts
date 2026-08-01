import assert from "node:assert/strict";

import {
  generateBlrCp003V9TopologyGapWave01ReviewedCandidates,
} from "./cp003-v9-topology-gap-wave-01-reviewed";
import {
  BLR_CP003_V9_WAVE01_APPROVAL_DATE,
  BLR_CP003_V9_WAVE01_APPROVAL_SCOPE,
  BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_VERSION,
  generateBlrCp003V9Wave01StructuralStagingApprovedRecords,
} from "./cp003-v9-wave01-structural-staging-approved";

const reviewed = generateBlrCp003V9TopologyGapWave01ReviewedCandidates();
const approved = generateBlrCp003V9Wave01StructuralStagingApprovedRecords();

assert.equal(
  BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_VERSION,
  "BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_V1",
);
assert.equal(BLR_CP003_V9_WAVE01_APPROVAL_SCOPE, "STRUCTURAL_STAGING_ONLY");
assert.equal(BLR_CP003_V9_WAVE01_APPROVAL_DATE, "2026-08-01");
assert.equal(reviewed.length, 96);
assert.equal(approved.length, 96);

const reviewedById = new Map(reviewed.map((record) => [record.itemId, record]));
const topologies = new Set<string>();
const prototypes = new Set<string>();
const passageGroups = new Set<string>();
const fingerprints = new Set<string>();
const answerPositions = [0, 0, 0, 0];

for (const record of approved) {
  const source = reviewedById.get(record.itemId);
  assert.ok(source, `Missing reviewed source for ${record.itemId}.`);

  assert.equal(record.sharedPrompt, source.sharedPrompt);
  assert.equal(record.stem, source.stem);
  assert.deepEqual(record.options, source.options);
  assert.equal(record.correctIndex, source.correctIndex);
  assert.deepEqual(record.evidencePaths, source.evidencePaths);
  assert.deepEqual(record.proceduralLogic, source.proceduralLogic);
  assert.deepEqual(record.editorial, source.editorial);

  assert.equal(record.metadata.humanReviewApproved, true);
  assert.equal(record.metadata.wave01StructuralStagingApproved, true);
  assert.equal(record.metadata.editorialBaselineApproved, false);
  assert.equal(record.metadata.structuralSaturationApproved, false);
  assert.equal(record.metadata.productionStagingApproved, false);
  assert.equal(record.metadata.approvalScope, "STRUCTURAL_STAGING_ONLY");
  assert.equal(record.metadata.approvedBy, "PROJECT_OWNER");
  assert.equal(record.metadata.approvalDate, "2026-08-01");

  assert.equal(record.permanentQlId, null);
  assert.equal(record.prototypeOnly, true);
  assert.equal(record.reviewOnly, true);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);

  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  topologies.add(record.topologyId);
  prototypes.add(record.prototypeId);
  passageGroups.add(`${record.scenarioId}::${record.seed}`);
  answerPositions[record.correctIndex] += 1;
}

assert.equal(topologies.size, 4);
assert.equal(prototypes.size, 12);
assert.equal(passageGroups.size, 32);
assert.equal(fingerprints.size, 96);
assert.deepEqual(answerPositions, [24, 24, 24, 24]);

console.log(
  JSON.stringify(
    {
      approvalVersion:
        BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_VERSION,
      approvalScope: BLR_CP003_V9_WAVE01_APPROVAL_SCOPE,
      approvalDate: BLR_CP003_V9_WAVE01_APPROVAL_DATE,
      approvedRecords: approved.length,
      topologies: topologies.size,
      prototypes: prototypes.size,
      passageGroups: passageGroups.size,
      answerPositions,
      humanReviewApproved: true,
      wave01StructuralStagingApproved: true,
      structuralSaturationApproved: false,
      productionStagingApproved: false,
      permanentQlCount: 0,
      verdict:
        "BLR-CP-003 V9 WAVE 01 IS APPROVED FOR STRUCTURAL STAGING ONLY; ALL FREEZE, RELEASE, QL-ALLOCATION AND PUBLICATION BOUNDARIES REMAIN LOCKED",
    },
    null,
    2,
  ),
);
