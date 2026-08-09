import assert from "node:assert/strict";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import { renderBlrCp003SvgFamilyTreeMarkup as renderV3 } from "./cp003-svg-family-tree-markup-v3";
import { generateBlrCp003V9TopologyGapWave02Candidates } from "./cp003-v9-topology-gap-wave-02";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION,
  generateBlrCp003V9TopologyGapWave02ReviewedCandidates,
} from "./cp003-v9-topology-gap-wave-02-reviewed";

const base = generateBlrCp003V9TopologyGapWave02Candidates();
const reviewed = generateBlrCp003V9TopologyGapWave02ReviewedCandidates();

assert.equal(
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION,
  "BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_V1",
);
assert.equal(base.length, 72);
assert.equal(reviewed.length, 72);

const prompts = new Map<string, string>();
const fingerprints = new Set<string>();
const stems = new Set<string>();
const shortcuts = new Set<string>();
const conclusions = new Set<string>();
let pairGrammarRemediatedRecords = 0;
let passageExclusionRemediatedRecords = 0;
let passageExclusionRemediatedGroups = 0;
let unaryStatusVisualRecords = 0;
let stemPersonalizedRecords = 0;
let roleLabelDiagramRecords = 0;
const remediatedGroups = new Set<string>();

for (let index = 0; index < reviewed.length; index += 1) {
  const source = base[index]!;
  const record = reviewed[index]!;
  assert.equal(record.itemId, source.itemId);
  assert.equal(record.answerSemanticKey, source.answerSemanticKey);
  assert.equal(record.correctIndex, source.correctIndex);
  assert.deepEqual(record.options, source.options);
  assert.deepEqual(record.evidencePaths, source.evidencePaths);
  assert.deepEqual(record.proceduralLogic.nodes, source.proceduralLogic.nodes);
  assert.deepEqual(record.proceduralLogic.edges, source.proceduralLogic.edges);
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
  assert.equal(record.metadata.manualEditorialAuditApplied, true);
  assert.equal(record.metadata.statusRoleLabelsAvailable, true);
  assert.equal(record.metadata.shortcutPersonalized, true);
  assert.equal(record.metadata.conclusionPersonalized, true);

  const groupKey = `${record.scenarioId}::${record.seed}`;
  const existingPrompt = prompts.get(groupKey);
  if (existingPrompt) assert.equal(record.sharedPrompt, existingPrompt);
  else prompts.set(groupKey, record.sharedPrompt);

  if (record.metadata.pairGrammarRemediated) {
    pairGrammarRemediatedRecords += 1;
  }
  if (record.metadata.passageExclusionRemediated) {
    passageExclusionRemediatedRecords += 1;
    remediatedGroups.add(groupKey);
    assert.notEqual(record.sharedPrompt, source.sharedPrompt);
  } else {
    assert.equal(record.sharedPrompt, source.sharedPrompt);
  }
  if (record.metadata.stemPersonalized) stemPersonalizedRecords += 1;

  const statusRecord =
    record.provisionalAuthority === "IDENTIFY_MEMBER_BY_MARITAL_STATUS" ||
    record.provisionalAuthority ===
      "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS";
  if (statusRecord) {
    unaryStatusVisualRecords += 1;
    const answerId = record.answerSemanticKey.split(":")[1]!;
    assert.equal(record.metadata.unaryStatusVisualAligned, true);
    assert.deepEqual(record.proceduralLogic.query?.pathPersonIds, [answerId]);
    assert.equal(record.proceduralLogic.query?.subjectId, undefined);
    assert.equal(record.proceduralLogic.query?.referenceId, undefined);
    assert.match(record.proceduralLogic.accessibleSummary, /Status evidence on the node:/);
  } else {
    assert.equal(record.metadata.unaryStatusVisualAligned, false);
    assert.deepEqual(record.proceduralLogic.query, source.proceduralLogic.query);
  }

  const roleNodes = record.proceduralLogic.nodes.filter((node) => node.roleLabel);
  const markup = renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic);
  if (roleNodes.length) {
    roleLabelDiagramRecords += 1;
    assert.equal((markup.match(/data-role-label="true"/g) ?? []).length, roleNodes.length);
    for (const node of roleNodes) {
      assert.ok(markup.includes(node.roleLabel!.toLocaleUpperCase("en-IN")));
    }
  } else {
    assert.equal(markup, renderV3(record.proceduralLogic));
  }

  const learnerText = [
    record.sharedPrompt,
    record.stem,
    ...record.editorial.coreConcept,
    ...record.editorial.stepByStepSolution,
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
    record.editorial.conclusion,
    record.editorial.examShortcut,
    ...record.editorial.commonTraps,
  ].join(" ");
  assert.doesNotMatch(learnerText, /\b[A-Z][a-z]+ and [A-Z][a-z]+ is the\b/);
  assert.doesNotMatch(record.sharedPrompt, /not married to (?:Anita|Gurleen)/i);

  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  assert.ok(!stems.has(record.stem));
  stems.add(record.stem);
  assert.ok(!shortcuts.has(record.editorial.examShortcut));
  shortcuts.add(record.editorial.examShortcut);
  assert.ok(!conclusions.has(record.editorial.conclusion));
  conclusions.add(record.editorial.conclusion);
}

passageExclusionRemediatedGroups = remediatedGroups.size;
assert.equal(prompts.size, 18);
assert.equal(fingerprints.size, 72);
assert.equal(stems.size, 72);
assert.equal(shortcuts.size, 72);
assert.equal(conclusions.size, 72);
assert.equal(pairGrammarRemediatedRecords, 30);
assert.equal(passageExclusionRemediatedRecords, 8);
assert.equal(passageExclusionRemediatedGroups, 2);
assert.equal(unaryStatusVisualRecords, 24);
assert.equal(stemPersonalizedRecords, 24);
assert.equal(roleLabelDiagramRecords, 48);

console.log(
  JSON.stringify(
    {
      reviewedVersion: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION,
      candidateRecords: reviewed.length,
      passageGroups: prompts.size,
      pairGrammarRemediatedRecords,
      passageExclusionRemediatedRecords,
      passageExclusionRemediatedGroups,
      unaryStatusVisualRecords,
      roleLabelDiagramRecords,
      uniqueStems: stems.size,
      uniqueShortcuts: shortcuts.size,
      uniqueConclusions: conclusions.size,
      humanReviewApproved: false,
      permanentQlCount: 0,
      verdict:
        "BLR-CP-003 V9 WAVE 02 REVIEWED LAYER CLOSES PAIR GRAMMAR, WEAK EXCLUSION AND UNARY STATUS VISUAL DEFECTS WITHOUT CHANGING ANSWERS, GRAPHS, AUTHORITIES OR RELEASE BOUNDARIES",
    },
    null,
    2,
  ),
);
