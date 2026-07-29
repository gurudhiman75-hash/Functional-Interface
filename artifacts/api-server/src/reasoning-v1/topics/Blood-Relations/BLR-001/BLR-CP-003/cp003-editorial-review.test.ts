import assert from "node:assert/strict";

import { generateBlrCp003EditorialReviewRecords } from "./cp003-review-registry";

const records = generateBlrCp003EditorialReviewRecords();
const answerPositions = [0, 0, 0, 0];
const scenarios = new Set<string>();
const topologies = new Set<string>();
const prototypes = new Set<string>();
const reviewFamilies = new Set<string>();
const fingerprints = new Set<string>();

assert.equal(records.length, 176);

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
  assert.equal(record.metadata.familyGraphValid, true);
  assert.equal(record.metadata.hiddenGraphAnswerAgreed, true);
  assert.equal(record.metadata.uniqueAnswer, true);
  assert.equal(record.metadata.optionSemanticsUnique, true);
  assert.equal(record.metadata.everyInputContributes, true);

  assert.ok(record.sharedPrompt.startsWith("Read the following"));
  assert.ok(record.sharedPrompt.length >= 100);
  assert.ok(record.stem.endsWith("?"));
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((option) => option.semanticKey)).size, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]?.isCorrect, true);
  assert.equal(record.options[record.correctIndex]?.semanticKey, record.answerKey);

  const visibleText = [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.editorial.coreConcept,
    ...record.editorial.normalizedFacts,
    ...record.editorial.familyRows,
    ...record.editorial.solutionSteps,
    record.editorial.conclusion,
    record.editorial.examShortcut,
    record.editorial.closestTrapRejection,
  ].join("\n");
  assert.ok(!visibleText.includes("undefined"));
  assert.ok(!visibleText.includes("[object Object]"));
  assert.ok(!visibleText.includes("__"));
  assert.ok(!/\b[A-Z]+_[A-Z_]+\b/.test(visibleText), `Visible enum leaked in ${record.itemId}.`);
  assert.ok(!/\s{2,}/.test(record.stem));
  assert.ok(!/\s{2,}/.test(record.editorial.conclusion));

  assert.equal(record.editorial.coreConcept.length, 2);
  assert.ok(record.editorial.coreConcept.every((line) => line.endsWith(".")));
  assert.ok(record.editorial.normalizedFacts.length >= 3);
  assert.ok(record.editorial.familyRows.length >= 2);
  assert.ok(
    record.editorial.familyRows.every(
      (row) => row.startsWith("Generation ") && row.includes(":"),
    ),
  );
  assert.ok(record.editorial.solutionSteps.length >= 1);
  assert.ok(record.editorial.conclusion.endsWith("."));
  assert.ok(record.editorial.examShortcut.length >= 40);
  assert.ok(record.editorial.closestTrapRejection.endsWith("."));

  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);
  answerPositions[record.correctIndex] += 1;
  scenarios.add(record.scenarioId);
  topologies.add(record.topologyId);
  prototypes.add(record.prototypeId);
  reviewFamilies.add(record.reviewFamily);
}

assert.equal(scenarios.size, 7);
assert.equal(topologies.size, 7);
assert.equal(prototypes.size, 17);
assert.deepEqual(
  [...reviewFamilies].sort(),
  [
    "BASE_SHARED_GRAPH",
    "EXPLICIT_MARITAL_STATUS",
    "EXTENDED_SHARED_GRAPH",
    "LINEAGE_AND_FOUR_GENERATION",
  ],
);
assert.ok(answerPositions.every((count) => count >= 30));
assert.ok(Math.max(...answerPositions) - Math.min(...answerPositions) <= 30);

console.log(
  JSON.stringify(
    {
      checkpointId: "BLR-CP-003",
      gate: "ENGLISH_EDITORIAL_REVIEW_V1",
      records: records.length,
      scenarios: scenarios.size,
      topologies: topologies.size,
      temporaryItemHandles: prototypes.size,
      reviewFamilies: [...reviewFamilies].sort(),
      answerPositions,
      editorialFingerprints: fingerprints.size,
      permanentQlCount: 0,
      publicDeliveryEnabled: false,
    },
    null,
    2,
  ),
);
