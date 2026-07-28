import assert from "node:assert/strict";

import { BLR_CP001_REVIEW_REGISTRY } from "./cp001-review-registry";

const bannedOpenings = [
  "Read the following family information carefully.",
  "Study the following family information carefully.",
  "Read the family statements and answer the question.",
  "Use the relations given below to reconstruct the family.",
  "Consider the following information about a family.",
] as const;

let generatedCount = 0;
let directOneClueCount = 0;
let exactLineageCount = 0;
let orderedPairCount = 0;
const answerPositions = [0, 0, 0, 0];
const observedWarnings = new Set<string>();

for (const entry of BLR_CP001_REVIEW_REGISTRY) {
  for (let seed = 0; seed < 40; seed += 1) {
    const question = entry.generate(seed);
    const explanation = question.explanation;
    const wrongOptions = question.options.filter((option) => !option.isCorrect);

    assert.ok(
      bannedOpenings.every((opening) => !question.stem.startsWith(opening)),
      `${entry.prototypeId}/${seed} retains an artificial lead-in.`,
    );
    assert.ok(
      !/related to .+ in which of the following ways\?/iu.test(question.stem),
      `${entry.prototypeId}/${seed} retains double-phrased direct wording.`,
    );
    assert.ok(question.stem.endsWith("?"));
    assert.ok(!question.stem.includes("  "));

    if (question.structuredPrompt.clues.length === 1) {
      directOneClueCount += 1;
      assert.ok(
        question.stem.startsWith("If ") || question.stem.split(". ").length === 2,
        `${entry.prototypeId}/${seed} one-clue stem is not compact.`,
      );
      assert.ok(question.stem.length < 180);
    }

    assert.ok(explanation.coreConcept && explanation.coreConcept.length >= 3);
    assert.ok(
      explanation.coreConcept.some((line) => line.includes("Generation mapping")),
    );
    assert.ok(explanation.familyTreeGrid);
    assert.ok(explanation.familyTreeGrid.includes("Reference:"));
    assert.ok(explanation.familyTreeGrid.includes("Generation  0:"));
    assert.ok(explanation.familyTreeGrid.includes("Connections:"));
    assert.ok(/\(\+\)|\(-\)/u.test(explanation.familyTreeGrid));
    assert.ok(explanation.familyTreeGrid.split("\n").length >= 4);
    assert.ok(explanation.generationAnalysis);
    assert.ok(explanation.examShortcut && explanation.examShortcut.length > 30);
    assert.equal(explanation.distractorAnalysis?.length, 3);
    assert.deepEqual(
      explanation.distractorAnalysis?.map((item) => item.errorLabel).sort(),
      wrongOptions.map((option) => option.errorLabel ?? "WRONG_OPTION").sort(),
    );
    for (const item of explanation.distractorAnalysis ?? []) {
      assert.ok(item.studentWarning.startsWith(`${item.optionValue}:`));
      assert.ok(item.studentWarning.length > item.optionValue.length + 35);
      assert.ok(!item.studentWarning.includes("undefined"));
      observedWarnings.add(item.errorLabel);
    }

    if (entry.authority === "RESOLVE_EXACT_LINEAGE_RELATION") {
      exactLineageCount += 1;
      assert.ok(
        explanation.coreConcept.some((line) => line.includes("maternal") && line.includes("paternal")),
      );
      assert.ok(/Mother's|Father's/u.test(explanation.examShortcut));
      assert.ok(
        explanation.queryPath.some((step) => step.includes("ΔGen =")),
        `${entry.prototypeId}/${seed} lacks generation arithmetic.`,
      );
    }

    if (entry.authority === "IDENTIFY_ORDERED_RELATION_PAIR") {
      orderedPairCount += 1;
      assert.ok(question.stem.includes("ordered pair"));
      assert.ok(explanation.examShortcut.includes("left to right"));
    }

    answerPositions[question.correctIndex] += 1;
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 440);
assert.ok(directOneClueCount > 0);
assert.equal(exactLineageCount, 40);
assert.equal(orderedPairCount, 40);
assert.deepEqual(answerPositions, [110, 110, 110, 110]);
assert.ok(observedWarnings.has("MATERNAL_PATERNAL_SWAP"));
assert.ok(observedWarnings.has("WRONG_RELATIVE_GENDER"));
assert.ok(observedWarnings.has("REVERSED_QUERY_DIRECTION"));

console.log("BLR-CP-001 human-audit remediation gate passed.", {
  generatedCount,
  directOneClueCount,
  exactLineageCount,
  orderedPairCount,
  answerPositions,
  warningFamilies: [...observedWarnings].sort(),
});
