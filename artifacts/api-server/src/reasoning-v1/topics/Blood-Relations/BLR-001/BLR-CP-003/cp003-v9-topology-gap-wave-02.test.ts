import assert from "node:assert/strict";

import { generateBlrCp003V8EditorialBaselineApprovedRecords } from "./cp003-v8-editorial-baseline-approved";
import { generateBlrCp003V9Wave01StructuralStagingApprovedRecords } from "./cp003-v9-wave01-structural-staging-approved";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  generateBlrCp003V9TopologyGapWave02Candidates,
} from "./cp003-v9-topology-gap-wave-02";
import {
  BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT,
  BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT_VERSION,
  blrCp003V9Wave02SplitCandidates,
} from "./cp003-v9-wave02-authority-audit";

function semanticIds(key: string): string[] {
  return key.split(":").slice(1);
}

const v8 = generateBlrCp003V8EditorialBaselineApprovedRecords();
const v9Wave01 = generateBlrCp003V9Wave01StructuralStagingApprovedRecords();
const wave = generateBlrCp003V9TopologyGapWave02Candidates();

assert.equal(
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  "BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_V1",
);
assert.equal(
  BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT_VERSION,
  "BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT_V1",
);
assert.equal(wave.length, 72);
assert.equal(BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT.length, 12);
assert.equal(blrCp003V9Wave02SplitCandidates().length, 2);
assert.deepEqual(
  [...new Set(blrCp003V9Wave02SplitCandidates())],
  ["IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS"],
);

const groups = new Map<string, string>();
const topologies = new Set<string>();
const prototypes = new Map<string, number>();
const fingerprints = new Set<string>();
const authorityCounts: Record<string, number> = {};
const answerTypeCounts: Record<string, number> = {};
const answerPositions = [0, 0, 0, 0];
let mixedRelationRecords = 0;
let unknownStatusRecords = 0;
let explicitStatusRecords = 0;
let nativeSvgRecords = 0;
let asciiFallbackRecords = 0;

for (const record of wave) {
  const groupKey = `${record.scenarioId}::${record.seed}`;
  const existing = groups.get(groupKey);
  if (existing) assert.equal(record.sharedPrompt, existing);
  else groups.set(groupKey, record.sharedPrompt);

  topologies.add(record.topologyId);
  prototypes.set(record.prototypeId, (prototypes.get(record.prototypeId) ?? 0) + 1);
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  authorityCounts[record.provisionalAuthority] =
    (authorityCounts[record.provisionalAuthority] ?? 0) + 1;
  answerTypeCounts[record.answerType] =
    (answerTypeCounts[record.answerType] ?? 0) + 1;
  answerPositions[record.correctIndex] = answerPositions[record.correctIndex]! + 1;

  if (record.metadata.mixedRelationContract) mixedRelationRecords += 1;
  if (
    record.provisionalAuthority ===
    "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS"
  ) {
    unknownStatusRecords += 1;
    const [answerId] = semanticIds(record.answerSemanticKey);
    assert.ok(record.metadata.unknownSpouseBoundaryIds.includes(answerId!));
    assert.ok(!record.metadata.explicitUnmarriedIds.includes(answerId!));
  }
  if (
    record.provisionalAuthority === "IDENTIFY_MEMBER_BY_MARITAL_STATUS"
  ) {
    explicitStatusRecords += 1;
    const [answerId] = semanticIds(record.answerSemanticKey);
    assert.ok(record.metadata.explicitUnmarriedIds.includes(answerId!));
    assert.ok(!record.metadata.unknownSpouseBoundaryIds.includes(answerId!));
  }

  assert.equal(record.metadata.negativeClueSystem, true);
  assert.ok(record.metadata.negativeClueCount >= 4);
  assert.equal(record.metadata.unknownStatusInferenceForbidden, true);
  assert.equal(record.metadata.humanReviewApproved, false);
  assert.equal(record.metadata.wave02StructuralStagingApproved, false);
  assert.equal(record.metadata.editorialBaselineApproved, false);
  assert.equal(record.metadata.structuralSaturationApproved, false);
  assert.equal(record.metadata.productionStagingApproved, false);
  assert.equal(record.permanentQlId, null);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
  assert.equal(record.editorial.solutionPhases.length, 4);
  assert.equal(record.options.length, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]!.semanticKey, record.answerSemanticKey);
  assert.ok(record.proceduralLogic.nodes.length >= 8);
  assert.ok(record.proceduralLogic.edges.length >= 10);
  assert.ok((record.proceduralLogic.query?.pathPersonIds.length ?? 0) >= 2);
  if (record.metadata.nativeSvgFamilyTree) nativeSvgRecords += 1;
  if (record.metadata.asciiFallbackRetained && record.proceduralLogic.asciiFallback) {
    asciiFallbackRecords += 1;
  }
}

assert.equal(groups.size, 18);
assert.equal(topologies.size, 3);
assert.equal(prototypes.size, 12);
assert.ok([...prototypes.values()].every((count) => count === 6));
assert.equal(fingerprints.size, 72);
assert.deepEqual(authorityCounts, {
  IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS: 12,
  IDENTIFY_MEMBER_BY_MARITAL_STATUS: 12,
  SELECT_UNORDERED_FAMILY_PAIR: 24,
  IDENTIFY_ALL_MEMBERS_BY_RELATION: 24,
});
assert.deepEqual(answerTypeCounts, {
  PERSON_NAME: 24,
  UNORDERED_PERSON_PAIR: 24,
  PERSON_NAME_SET: 24,
});
assert.deepEqual(answerPositions, [18, 18, 18, 18]);
assert.equal(mixedRelationRecords, 36);
assert.equal(unknownStatusRecords, 12);
assert.equal(explicitStatusRecords, 12);
assert.equal(nativeSvgRecords, 72);
assert.equal(asciiFallbackRecords, 72);

const combined = [...v8, ...v9Wave01, ...wave];
const combinedGroups = new Set(combined.map((record) => `${record.scenarioId}::${record.seed}`));
const combinedTopologies = new Set(combined.map((record) => record.topologyId));
const combinedPrototypes = new Set(combined.map((record) => record.prototypeId));
const combinedAnswerPositions = [0, 0, 0, 0];
for (const record of combined) {
  combinedAnswerPositions[record.correctIndex] =
    combinedAnswerPositions[record.correctIndex]! + 1;
}

assert.equal(v8.length, 130);
assert.equal(v9Wave01.length, 96);
assert.equal(combined.length, 298);
assert.equal(combinedGroups.size, 102);
assert.equal(combinedTopologies.size, 9);
assert.equal(combinedPrototypes.size, 29);
assert.deepEqual(combinedAnswerPositions, [74, 75, 75, 74]);

console.log(
  JSON.stringify(
    {
      gapWaveVersion: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
      candidateRecords: wave.length,
      passageGroups: groups.size,
      topologyCount: topologies.size,
      prototypeCount: prototypes.size,
      authorityCounts,
      answerTypeCounts,
      answerPositions,
      mixedRelationRecords,
      unknownStatusRecords,
      explicitStatusRecords,
      combinedDiscoveryEvidence: {
        records: combined.length,
        passageGroups: combinedGroups.size,
        topologies: combinedTopologies.size,
        prototypes: combinedPrototypes.size,
        answerPositions: combinedAnswerPositions,
      },
      permanentQlCount: 0,
      humanReviewApproved: false,
      structuralSaturationApproved: false,
      verdict:
        "BLR-CP-003 V9 WAVE 02 PROVIDES BALANCED NEGATIVE-CLUE, UNKNOWN-SPOUSE-BOUNDARY AND MIXED IN-LAW/GENERATION DISCOVERY EVIDENCE WITHOUT CLAIMING SATURATION OR RELEASE",
    },
    null,
    2,
  ),
);
