import assert from "node:assert/strict";

import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
  generateBlrCp003V9TopologyGapWave01ReviewedCandidates,
} from "./cp003-v9-topology-gap-wave-01-reviewed";

const records = generateBlrCp003V9TopologyGapWave01ReviewedCandidates();
const groups = new Map<string, string>();
const fingerprints = new Set<string>();
const correctedGroups = new Set<string>();
const correctionRecords = records.filter(
  (record) => record.metadata.passageEvidenceRemediated,
);

assert.equal(
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
  "BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_V1",
);
assert.equal(records.length, 96);
assert.equal(correctionRecords.length, 42);

for (const record of records) {
  const groupKey = `${record.scenarioId}::${record.seed}`;
  const existing = groups.get(groupKey);
  if (existing) assert.equal(record.sharedPrompt, existing);
  else groups.set(groupKey, record.sharedPrompt);

  if (record.metadata.passageEvidenceRemediated) correctedGroups.add(groupKey);
  assert.equal(record.metadata.manualPassageAuditApplied, true);
  assert.equal(record.metadata.targetGenderEvidenceComplete, true);
  assert.equal(record.metadata.exactLineageRoleEvidenceComplete, true);
  assert.equal(record.metadata.spouseEvidenceComplete, true);
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);

  assert.equal(record.metadata.humanReviewApproved, false);
  assert.equal(record.metadata.editorialBaselineApproved, false);
  assert.equal(record.metadata.structuralSaturationApproved, false);
  assert.equal(record.metadata.productionStagingApproved, false);
  assert.equal(record.permanentQlId, null);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
}

assert.equal(groups.size, 32);
assert.equal(correctedGroups.size, 14);
assert.equal(fingerprints.size, 96);

const compositePairRecords = records.filter(
  (record) =>
    record.prototypeId === "BLR-CP003-PROT-V9-COMPOSITE-REFERENCE-PAIR",
);
assert.equal(compositePairRecords.length, 8);
for (const record of compositePairRecords) {
  const maleCousinId = record.answerSemanticKey.split(":")[1]!;
  const maleCousinName = record.proceduralLogic.nodes.find(
    (node) => node.id === maleCousinId,
  )!.label;
  assert.match(
    record.sharedPrompt,
    new RegExp(`(?:son\\s+${maleCousinName}|${maleCousinName}\\s+is\\s+the\\s+son)`, "i"),
  );
}

const maternalLineageRecords = records.filter(
  (record) =>
    record.prototypeId ===
    "BLR-CP003-PROT-V9-MATERNAL-UNCLE-DAUGHTER-LINEAGE",
);
assert.equal(maternalLineageRecords.length, 8);
for (const record of maternalLineageRecords) {
  const targetName = record.options[record.correctIndex]!.text;
  assert.match(
    record.sharedPrompt,
    new RegExp(`(?:daughter[^.]*${targetName}|${targetName}[^.]*daughter)`, "i"),
  );
}

const greatGrandmotherRecords = records.filter(
  (record) =>
    record.prototypeId ===
    "BLR-CP003-PROT-V9-GREAT-GRANDMOTHER-EXACT-LINEAGE",
);
assert.equal(greatGrandmotherRecords.length, 8);
for (const record of greatGrandmotherRecords) {
  const answerName = record.options[record.correctIndex]!.text;
  const maximumGeneration = Math.max(
    ...record.proceduralLogic.nodes.map((node) => node.generation),
  );
  const topMaleName = record.proceduralLogic.nodes.find(
    (node) => node.generation === maximumGeneration && node.gender === "male",
  )!.label;
  assert.ok(
    record.sharedPrompt.includes(`${topMaleName} and ${answerName} are married`) ||
      record.sharedPrompt.includes(`${answerName} is the wife`),
  );
}

console.log(
  JSON.stringify(
    {
      reviewedVersion: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
      candidateRecords: records.length,
      passageGroups: groups.size,
      remediatedRecords: correctionRecords.length,
      remediatedPassageGroups: correctedGroups.size,
      maleCousinEvidenceCorrections: compositePairRecords.length,
      daughterRoleEvidenceChecks: maternalLineageRecords.length,
      topMarriageEvidenceChecks: greatGrandmotherRecords.length,
      humanReviewApproved: false,
      permanentQlCount: 0,
      verdict:
        "BLR-CP-003 V9 WAVE 01 REVIEWED LAYER CLOSES ALL MANUALLY FOUND PASSAGE-EVIDENCE GAPS WITHOUT INHERITING V8 APPROVAL OR UNLOCKING RELEASE",
    },
    null,
    2,
  ),
);
