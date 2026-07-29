import assert from "node:assert/strict";

import { generateBlrCp003TeacherReviewV3Records } from "./cp003-teacher-editorial-finalizer";

const records = generateBlrCp003TeacherReviewV3Records();
const answerPositions = [0, 0, 0, 0];
const groups = new Set<string>();
const scenarios = new Set<string>();
const prototypes = new Set<string>();
const fingerprints = new Set<string>();

const ENGINE_JARGON =
  /PAIR:[A-Z0-9_]+|PERSON_SET:|CLAIM:|::|NON_[A-Z_]+|supported family path|shortest supported path|Trace the relation|reconstructed family graph|subject-to-reference/i;

assert.equal(records.length, 208);

for (const record of records) {
  assert.equal(record.packageId, "BLR-001");
  assert.equal(record.checkpointId, "BLR-CP-003");
  assert.equal(record.permanentQlId, null);
  assert.equal(record.prototypeOnly, true);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
  assert.equal(record.locale, "en-IN");
  assert.equal(record.metadata.runtimeVersion, "blr-cp003-teacher-editorial-v3");
  assert.equal(record.metadata.familyGraphValid, true);
  assert.equal(record.metadata.hiddenGraphAnswerAgreed, true);
  assert.equal(record.metadata.uniqueAnswer, true);
  assert.equal(record.metadata.optionSemanticsUnique, true);
  assert.equal(record.metadata.everyInputContributes, true);

  assert.ok(record.sharedPrompt.startsWith("Read the following"));
  assert.ok(record.stem.endsWith("?"));
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.text)).size, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.isCorrect, true);

  const tree = record.editorial.familyTreeGrid;
  assert.ok(tree.includes("VISUAL FAMILY TREE GRID"));
  assert.ok(tree.includes("Generation +1"));
  assert.ok(tree.includes("(+)"));
  assert.ok(tree.includes("(-)"));
  assert.ok(tree.includes("========"));
  assert.ok(tree.includes("│"));
  assert.ok(tree.includes("──"));
  assert.ok(tree.includes("Key: (+) = Male"));
  assert.ok(!tree.includes("(?)"), `Unknown gender leaked into ${record.itemId}.`);

  assert.equal(record.editorial.coreConcept.length, 2);
  assert.ok(record.editorial.coreConcept.every((line) => line.endsWith(".")));
  assert.ok(record.editorial.stepByStepSolution.length >= 3);
  assert.ok(record.editorial.stepByStepSolution[0]?.startsWith("First, let's draw"));
  assert.equal(record.editorial.optionAnalysis.length, 4);
  assert.deepEqual(
    record.editorial.optionAnalysis.map((entry) => entry.optionLabel),
    ["A", "B", "C", "D"],
  );
  assert.equal(
    record.editorial.optionAnalysis.filter((entry) => entry.isCorrect).length,
    1,
  );
  assert.ok(
    record.editorial.optionAnalysis.every(
      (entry, index) =>
        entry.optionText === record.options[index]?.text &&
        entry.isCorrect === record.options[index]?.isCorrect &&
        entry.explanation.endsWith("."),
    ),
  );
  assert.ok(record.editorial.conclusion.endsWith("."));
  assert.ok(record.editorial.examShortcut.length >= 45);
  assert.ok(record.editorial.commonTraps.length >= 1);
  assert.ok(record.editorial.commonTraps[0]?.startsWith("Don't fall for Option "));

  const visibleText = [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.editorial.coreConcept,
    record.editorial.familyTreeGrid,
    ...record.editorial.stepByStepSolution,
    ...record.editorial.optionAnalysis.flatMap((entry) => [
      `Option ${entry.optionLabel}`,
      entry.optionText,
      entry.explanation,
    ]),
    record.editorial.conclusion,
    record.editorial.examShortcut,
    ...record.editorial.commonTraps,
  ].join("\n");
  assert.ok(!ENGINE_JARGON.test(visibleText), `Engine jargon leaked into ${record.itemId}.`);
  assert.ok(!visibleText.includes("undefined"));
  assert.ok(!visibleText.includes("[object Object]"));
  assert.ok(!visibleText.includes(" is same generation "));
  assert.ok(!visibleText.includes(" of itself."));
  assert.ok(!/\b[A-Z]+_[A-Z_]+\b/.test(visibleText), `Visible enum leaked into ${record.itemId}.`);

  const relationMatch = /^How is (.+) related to (.+)\?$/.exec(record.stem);
  if (relationMatch) {
    const answer = record.options[record.correctIndex]!.text.toLocaleLowerCase("en-IN");
    assert.equal(
      record.editorial.conclusion,
      `${relationMatch[1]} is the ${answer} of ${relationMatch[2]}.`,
    );
    assert.ok(
      record.editorial.commonTraps.some(
        (line) =>
          line.includes(`how ${relationMatch[1]} is related to ${relationMatch[2]}`) &&
          line.includes(`not how ${relationMatch[2]} is related to ${relationMatch[1]}`),
      ),
    );
  }

  const lineageMatch = /^What is the exact relation of (.+) to (.+)\?$/.exec(record.stem);
  if (lineageMatch) {
    const answer = record.options[record.correctIndex]!.text.toLocaleLowerCase("en-IN");
    assert.equal(
      record.editorial.conclusion,
      `${lineageMatch[1]} is the ${answer} of ${lineageMatch[2]}.`,
    );
  }

  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  answerPositions[record.correctIndex] += 1;
  groups.add(`${record.scenarioId}::${record.seed}`);
  scenarios.add(record.scenarioId);
  prototypes.add(record.prototypeId);
}

assert.equal(groups.size, 32);
assert.equal(scenarios.size, 8);
assert.equal(prototypes.size, 18);
assert.deepEqual(answerPositions, [57, 53, 49, 49]);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "TEACHER_EDITORIAL_VISUAL_V3",
      groups: groups.size,
      records: records.length,
      scenarios: scenarios.size,
      temporaryItemHandles: prototypes.size,
      answerPositions,
      visualFamilyTreeOnEveryRecord: true,
      fourTierTeacherStyleOnEveryRecord: true,
      optionSpecificTeachingOnEveryRecord: true,
      directionConclusionVerified: true,
      rawEngineJargonVisible: false,
      residualAwkwardPhrasingVisible: false,
      permanentQlCount: 0,
      publicDeliveryEnabled: false,
    },
    null,
    2,
  ),
);
