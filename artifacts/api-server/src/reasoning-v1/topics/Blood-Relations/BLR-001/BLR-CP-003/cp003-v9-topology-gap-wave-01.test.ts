import assert from "node:assert/strict";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import { generateBlrCp003V8EditorialBaselineApprovedRecords } from "./cp003-v8-editorial-baseline-approved";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
  BLR_CP003_V9_WAVE_01_SEEDS,
  BLR_CP003_V9_WAVE_01_TOPOLOGIES,
  blrCp003V9Wave01AuthorityCounts,
  blrCp003V9Wave01PrototypeIds,
  blrCp003V9Wave01TopologyCounts,
  generateBlrCp003V9TopologyGapWave01Candidates,
} from "./cp003-v9-topology-gap-wave-01";

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

const baseline = generateBlrCp003V8EditorialBaselineApprovedRecords();
const wave = generateBlrCp003V9TopologyGapWave01Candidates();
const authorityCounts = blrCp003V9Wave01AuthorityCounts(wave);
const topologyCounts = blrCp003V9Wave01TopologyCounts(wave);
const prototypeIds = blrCp003V9Wave01PrototypeIds(wave);
const itemIds = new Set<string>();
const fingerprints = new Set<string>();
const groups = new Set<string>();
const answerPositions = [0, 0, 0, 0];

assert.equal(
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
  "BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_V1",
);
assert.equal(BLR_CP003_V9_WAVE_01_SEEDS.length, 8);
assert.equal(BLR_CP003_V9_WAVE_01_TOPOLOGIES.length, 4);
assert.equal(baseline.length, 130);
assert.equal(wave.length, 96);
assert.equal(baseline.length + wave.length, 226);
assert.equal(prototypeIds.length, 12);
assert.deepEqual(authorityCounts, {
  SELECT_UNORDERED_FAMILY_PAIR: 32,
  IDENTIFY_ALL_MEMBERS_BY_RELATION: 32,
  IDENTIFY_MEMBER_BY_MARITAL_STATUS: 16,
  IDENTIFY_PERSON_BY_EXACT_LINEAGE: 16,
});
assert.deepEqual(topologyCounts, {
  MULTI_MARRIED_SIBLING_IN_LAW: 24,
  MATERNAL_PATERNAL_DUAL_BRANCH: 24,
  FOUR_GENERATION_ASYMMETRIC_LINEAGE: 24,
  UNEQUAL_COUSIN_BRANCHES: 24,
});

for (const record of baseline) {
  assert.equal(record.metadata.editorialBaselineApproved, true);
  assert.equal(record.metadata.approvalScope, "EDITORIAL_STAGING_ONLY");
  assert.equal(record.metadata.structuralSaturationApproved, false);
  assert.equal(record.metadata.productionStagingApproved, false);
}

for (const record of wave) {
  assert.ok(!itemIds.has(record.itemId));
  itemIds.add(record.itemId);
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  groups.add(`${record.scenarioId}::${record.seed}`);

  assert.equal(record.packageId, "BLR-001");
  assert.equal(record.checkpointId, "BLR-CP-003");
  assert.equal(record.permanentQlId, null);
  assert.equal(record.prototypeOnly, true);
  assert.equal(record.reviewOnly, true);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
  assert.equal(record.metadata.humanReviewApproved, false);
  assert.equal(record.metadata.editorialBaselineApproved, false);
  assert.equal(record.metadata.structuralSaturationApproved, false);
  assert.equal(record.metadata.productionStagingApproved, false);
  assert.equal(record.metadata.newTopology, true);
  assert.equal(record.metadata.newPrototype, true);
  assert.equal(record.metadata.authenticExamStem, true);
  assert.equal(record.metadata.nameBasedOptions, true);
  assert.equal(record.metadata.phaseStructuredExplanation, true);
  assert.equal(record.metadata.passageAudit.stackedLinearChain, false);
  assert.equal(
    record.metadata.passageAudit.clueOrderStrategy,
    "DISJOINT_NON_TOPOLOGICAL",
  );
  assert.ok(record.metadata.passageAudit.indirectAnchorCount >= 2);
  assert.ok(record.metadata.passageAudit.generationTransitionCount >= 3);

  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.text)).size, 4);
  assert.equal(new Set(record.options.map((option) => option.semanticKey)).size, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.isCorrect, true);
  answerPositions[record.correctIndex] += 1;

  assert.equal(record.editorial.solutionPhases.length, 4);
  assert.deepEqual(
    record.editorial.solutionPhases.map((phase) => phase.title),
    [
      "Phase 1 — Map generation levels",
      "Phase 2 — Connect family branches",
      "Phase 3 — Trace the required relation",
      "Phase 4 — Verify the options",
    ],
  );
  assert.ok(record.editorial.solutionPhases.every((phase) => phase.points.length >= 2));
  assert.equal(record.editorial.optionAnalysis.length, 4);
  assert.ok(record.editorial.optionAnalysis.every((entry) => entry.explanation.length > 25));

  const learnerText = [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
  ].join(" ");
  assert.doesNotMatch(
    learnerText,
    /Don't fall for Option|Cannot be determined|The passage is contradictory|Divorced/i,
  );

  const pathIds = record.proceduralLogic.query?.pathPersonIds ?? [];
  const highlightedNodes = new Set(pathIds);
  const highlightedPairs = new Set(
    pathIds.slice(0, -1).map((id, index) => pairKey(id, pathIds[index + 1]!)),
  );
  for (const evidencePath of record.evidencePaths) {
    assert.ok(evidencePath.distance >= 2);
    assert.equal(evidencePath.personIds.length, evidencePath.distance + 1);
    for (const personId of evidencePath.personIds) {
      assert.ok(highlightedNodes.has(personId));
    }
    for (let index = 0; index < evidencePath.personIds.length - 1; index += 1) {
      assert.ok(
        highlightedPairs.has(
          pairKey(evidencePath.personIds[index]!, evidencePath.personIds[index + 1]!),
        ),
      );
    }
  }

  const markup = renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic);
  assert.ok(markup.includes("<svg"));
  assert.ok(markup.includes("Answer:"));
  assert.ok(!markup.includes("undefined"));
  assert.ok(!markup.includes("[object Object]"));
  assert.ok(record.proceduralLogic.asciiFallback.includes("VISUAL FAMILY TREE GRID"));
}

assert.equal(itemIds.size, 96);
assert.equal(fingerprints.size, 96);
assert.equal(groups.size, 32);
assert.deepEqual(answerPositions, [24, 24, 24, 24]);

const totalTopologies = new Set([
  ...baseline.map((record) => record.topologyId),
  ...wave.map((record) => record.topologyId),
]);
const totalPrototypes = new Set([
  ...baseline.map((record) => record.prototypeId),
  ...wave.map((record) => record.prototypeId),
]);
const totalGroups = new Set([
  ...baseline.map((record) => `${record.scenarioId}::${record.seed}`),
  ...wave.map((record) => `${record.scenarioId}::${record.seed}`),
]);
const combinedAnswerPositions = [0, 0, 0, 0];
for (const record of [...baseline, ...wave]) {
  combinedAnswerPositions[record.correctIndex] += 1;
}

assert.equal(totalTopologies.size, 6);
assert.equal(totalPrototypes.size, 17);
assert.equal(totalGroups.size, 84);
assert.deepEqual(combinedAnswerPositions, [56, 57, 57, 56]);

const fourGenerationRecords = wave.filter(
  (record) => record.topologyId === "FOUR_GENERATION_ASYMMETRIC_LINEAGE",
);
assert.equal(fourGenerationRecords.length, 24);
for (const record of fourGenerationRecords) {
  assert.equal(new Set(record.proceduralLogic.nodes.map((node) => node.generation)).size, 4);
}

const exactLineageRecords = wave.filter(
  (record) => record.provisionalAuthority === "IDENTIFY_PERSON_BY_EXACT_LINEAGE",
);
assert.equal(exactLineageRecords.length, 16);
const exactLineageDistances = exactLineageRecords
  .map((record) => record.evidencePaths[0]!.distance)
  .sort((left, right) => left - right);
assert.deepEqual(exactLineageDistances, [
  3, 3, 3, 3, 3, 3, 3, 3,
  4, 4, 4, 4, 4, 4, 4, 4,
]);

console.log(
  JSON.stringify(
    {
      gapWaveVersion: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
      approvedV8BaselineRecords: baseline.length,
      newWaveRecords: wave.length,
      combinedCandidateRecords: baseline.length + wave.length,
      newPassageGroups: groups.size,
      combinedPassageGroups: totalGroups.size,
      newTopologies: BLR_CP003_V9_WAVE_01_TOPOLOGIES.length,
      combinedTopologies: totalTopologies.size,
      newPrototypes: prototypeIds.length,
      combinedPrototypes: totalPrototypes.size,
      authorityCounts,
      answerPositions,
      combinedAnswerPositions,
      exactLineageDistances,
      permanentQlCount: 0,
      newWaveHumanReviewApproved: false,
      structuralSaturationProven: false,
      verdict:
        "BLR-CP-003 V9 TOPOLOGY GAP WAVE 01 ADDS FOUR GENUINELY NEW GRAPHS AND TWELVE NEW PROTOTYPES WITH COMPLETE VISUAL AND EDITORIAL PROOF; NEW CONTENT STILL REQUIRES HUMAN REVIEW AND DOES NOT COMPLETE SATURATION",
    },
    null,
    2,
  ),
);
