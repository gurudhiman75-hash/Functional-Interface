import assert from "node:assert/strict";

import {
  BLR_CP003_MAX_DIRECT_TEXT_MATCH,
  BLR_CP003_MIN_GRAPH_DISTANCE,
  BLR_CP003_REJECT_KEYWORDS,
} from "./cp003-competitive-exam-gate";
import { generateBlrCp003CompetitiveReviewV4Bundle } from "./cp003-competitive-review-v4";

const bundle = generateBlrCp003CompetitiveReviewV4Bundle();
const records = bundle.selected;
const rejected = bundle.rejected;
const groups = new Map<string, number>();
const answerPositions = [0, 0, 0, 0];
const rejectionReasons = new Map<string, number>();
const prototypes = new Map<string, number>();
const fingerprints = new Set<string>();

assert.equal(bundle.sourceRecordCount, 208);
assert.ok(records.length > 0);
assert.equal(
  bundle.sourceEligibleRecordCount + rejected.length,
  bundle.sourceRecordCount,
);
assert.equal(
  records.length,
  bundle.sourceEligibleRecordCount + bundle.supplementalRecordCount,
);
assert.equal(bundle.supplementalRecordCount, 12);

for (const rejectedRecord of rejected) {
  assert.equal(rejectedRecord.audit.examEligible, false);
  assert.ok(rejectedRecord.audit.rejectionReasons.length >= 1);
  for (const reason of rejectedRecord.audit.rejectionReasons) {
    rejectionReasons.set(reason, (rejectionReasons.get(reason) ?? 0) + 1);
  }
}

for (const record of records) {
  assert.equal(record.packageId, "BLR-001");
  assert.equal(record.checkpointId, "BLR-CP-003");
  assert.equal(record.permanentQlId, null);
  assert.equal(record.prototypeOnly, true);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
  assert.equal(record.metadata.runtimeVersion, "blr-cp003-competitive-review-v4");
  assert.equal(record.metadata.competitiveExamEligible, true);
  assert.ok(record.metadata.minimumGraphDistance >= BLR_CP003_MIN_GRAPH_DISTANCE);
  assert.equal(record.metadata.directTextMatchCount, BLR_CP003_MAX_DIRECT_TEXT_MATCH);
  assert.equal(
    record.metadata.claimOptionDirectTextMatchCount,
    BLR_CP003_MAX_DIRECT_TEXT_MATCH,
  );
  if (record.metadata.claimOptionMinimumGraphDistance !== null) {
    assert.ok(
      record.metadata.claimOptionMinimumGraphDistance >=
        BLR_CP003_MIN_GRAPH_DISTANCE,
    );
  }
  assert.equal(record.metadata.hasAsciiFamilyTree, true);
  assert.equal(record.metadata.hasFourTierTeacherVoice, true);
  assert.equal(record.metadata.reverseTrapExplained, true);

  const tree = record.editorial.familyTreeGrid;
  assert.ok(tree.includes("VISUAL FAMILY TREE GRID"));
  assert.ok(tree.includes("Generation +1"));
  assert.ok(tree.includes("│"));
  assert.ok(tree.includes("Key: (+) = Male"));
  assert.equal(record.editorial.coreConcept.length, 2);
  assert.ok(record.editorial.stepByStepSolution.length >= 3);
  assert.ok(record.editorial.examShortcut.length >= 45);
  assert.ok(record.editorial.commonTraps.length >= 1);
  assert.ok(record.editorial.commonTraps.every((line) => line.startsWith("⚠️")));
  assert.equal(record.editorial.optionAnalysis.length, 4);
  assert.ok(
    record.editorial.optionAnalysis.every((entry) =>
      entry.isCorrect
        ? entry.explanation.startsWith(`✅ Option ${entry.optionLabel}`)
        : entry.explanation.startsWith(`⚠️ Don't fall for Option ${entry.optionLabel}!`),
    ),
  );

  const visibleText = [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.editorial.coreConcept,
    record.editorial.familyTreeGrid,
    ...record.editorial.stepByStepSolution,
    ...record.editorial.optionAnalysis.flatMap((entry) => [
      entry.optionText,
      entry.explanation,
    ]),
    record.editorial.conclusion,
    record.editorial.examShortcut,
    ...record.editorial.commonTraps,
  ].join("\n");
  for (const keyword of BLR_CP003_REJECT_KEYWORDS) {
    assert.ok(
      !visibleText.toLocaleLowerCase("en-IN").includes(
        keyword.toLocaleLowerCase("en-IN"),
      ),
      `${keyword} leaked into ${record.itemId}.`,
    );
  }
  assert.ok(!visibleText.includes("undefined"));
  assert.ok(!visibleText.includes("[object Object]"));

  const direction = /^How is (.+) related to (.+)\?$/.exec(record.stem);
  if (direction) {
    const answer = record.options[record.correctIndex]!.text.toLocaleLowerCase("en-IN");
    assert.equal(
      record.editorial.conclusion,
      `${direction[1]} is the ${answer} of ${direction[2]}.`,
    );
    assert.ok(
      record.editorial.stepByStepSolution.some(
        (line) =>
          line.includes(`${direction[1]} → ${direction[2]}`) &&
          line.includes(`describe ${direction[1]}`),
      ),
    );
  }
  if (record.metadata.reverseTrapRequired) {
    assert.ok(
      record.editorial.optionAnalysis.some(
        (entry) => !entry.isCorrect && entry.explanation.includes("reverse relation"),
      ),
    );
    assert.ok(
      record.editorial.commonTraps.some((line) => line.includes("reverse question")),
    );
  }

  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  const groupKey = `${record.scenarioId}::${record.seed}`;
  groups.set(groupKey, (groups.get(groupKey) ?? 0) + 1);
  answerPositions[record.correctIndex] += 1;
  prototypes.set(record.prototypeId, (prototypes.get(record.prototypeId) ?? 0) + 1);
}

const diagnostic = {
  checkpointId: "BLR-CP-003",
  gate: "COMPETITIVE_EXAM_DERIVED_ONLY_V4",
  sourceRecords: bundle.sourceRecordCount,
  sourceEligibleRecords: bundle.sourceEligibleRecordCount,
  supplementalDerivedRecords: bundle.supplementalRecordCount,
  selectedRecords: records.length,
  rejectedRecords: rejected.length,
  passageGroups: groups.size,
  minimumQuestionsPerPassage: Math.min(...groups.values()),
  maximumQuestionsPerPassage: Math.max(...groups.values()),
  groupSizes: Object.fromEntries([...groups].sort()),
  answerPositions,
  selectedPrototypes: Object.fromEntries([...prototypes].sort()),
  rejectionReasons: Object.fromEntries([...rejectionReasons].sort()),
  minGraphDistance: BLR_CP003_MIN_GRAPH_DISTANCE,
  maxDirectTextMatch: BLR_CP003_MAX_DIRECT_TEXT_MATCH,
  mandatoryAsciiTree: true,
  fourTierTeacherVoice: true,
  allDistractorsFriendlyWarned: true,
  reverseDirectionTrapExplained: true,
  permanentQlCount: 0,
  publicDeliveryEnabled: false,
};

console.log(JSON.stringify(diagnostic, null, 2));

assert.equal(groups.size, 32);
assert.ok(Math.min(...groups.values()) >= 3);
assert.equal(records.length, 128);
assert.equal(bundle.sourceEligibleRecordCount, 116);
assert.equal(rejected.length, 92);
