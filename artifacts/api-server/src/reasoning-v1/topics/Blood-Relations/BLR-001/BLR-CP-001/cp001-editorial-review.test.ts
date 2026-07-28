import assert from "node:assert/strict";

import {
  BLR_CP001_REVIEW_REGISTRY,
  type BlrCp001ProvisionalAuthority,
} from "./cp001-review-registry";

assert.equal(BLR_CP001_REVIEW_REGISTRY.length, 11);
assert.equal(
  new Set(BLR_CP001_REVIEW_REGISTRY.map((entry) => entry.prototypeId)).size,
  11,
);

const expectedAuthorities: readonly BlrCp001ProvisionalAuthority[] = [
  "RESOLVE_NAMED_PERSON_RELATION",
  "IDENTIFY_PERSON_BY_RELATION",
  "IDENTIFY_PERSON_BY_GENDER",
  "IDENTIFY_ORDERED_RELATION_PAIR",
  "SELECT_RELATION_CLAIM",
  "COMPARE_GENERATIONS",
  "RESOLVE_EXACT_LINEAGE_RELATION",
] as const;

const answerPositions = [0, 0, 0, 0];
const observedAuthorities = new Set<BlrCp001ProvisionalAuthority>();
const observedPrototypes = new Set<string>();
const observedDifficulties = new Set<string>();
const observedRenderers = new Set<string>();
const observedAnswerTypes = new Set<string>();
const stemFingerprints = new Set<string>();
let generatedCount = 0;
let explanationWordCount = 0;

for (const entry of BLR_CP001_REVIEW_REGISTRY) {
  observedAuthorities.add(entry.authority);
  observedPrototypes.add(entry.prototypeId);

  for (let seed = 0; seed < 40; seed += 1) {
    const question = entry.generate(seed);
    const repeat = entry.generate(seed);
    assert.deepEqual(
      repeat,
      question,
      `${entry.prototypeId}/${seed} must remain deterministic during editorial review.`,
    );

    assert.equal(question.packageId, "BLR-001");
    assert.equal(question.checkpointId, "BLR-CP-001");
    assert.equal(question.prototypeId, entry.prototypeId);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.prototypeOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.locale, "en-IN");
    assert.ok(question.metadata.runtimeVersion.startsWith("blr-cp001-"));
    assert.ok(question.metadata.hiddenFingerprint.length >= 8);

    assert.ok(question.stem.length > 80, `${entry.prototypeId}/${seed} stem is too short.`);
    assert.ok(question.stem.endsWith("?"), `${entry.prototypeId}/${seed} must end with a question.`);
    assert.equal(question.stem.trim(), question.stem);
    assert.ok(!question.stem.includes("  "));
    assert.ok(!/\b(?:undefined|null|NaN)\b/.test(question.stem));
    assert.ok(!question.stem.includes("BLR-"));
    assert.ok(!question.stem.includes("_"));

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.ok(
      question.options.every(
        (option) => option.value.length > 0 && option.value.trim() === option.value,
      ),
    );
    assert.ok(
      question.options
        .filter((option) => !option.isCorrect)
        .every((option) => Boolean(option.errorLabel)),
    );

    const explanation = question.explanation;
    assert.ok(explanation.ruleStatement.length > 40);
    assert.equal(
      explanation.normalizedClues.length,
      question.structuredPrompt.clues.length,
    );
    assert.ok(explanation.normalizedClues.every((clue) => clue.endsWith(".")));
    assert.ok(explanation.queryPath.length >= 2);
    assert.ok(explanation.queryPath.every((step) => step.length > 5));
    assert.ok(explanation.conclusion.length > 20);
    assert.ok(
      explanation.conclusion
        .toLocaleLowerCase("en-IN")
        .includes(
          question.options[question.correctIndex]!.value.toLocaleLowerCase("en-IN"),
        ),
      `${entry.prototypeId}/${seed} conclusion must state the displayed answer.`,
    );
    assert.ok(
      explanation.closestTrapRejection &&
        explanation.closestTrapRejection.length > 40,
    );

    const learnerText = [
      question.stem,
      ...question.options.map((option) => option.value),
      explanation.ruleStatement,
      ...explanation.normalizedClues,
      ...explanation.queryPath,
      explanation.conclusion,
      explanation.closestTrapRejection ?? "",
    ].join("\n");
    assert.ok(!/\b(?:undefined|null|NaN)\b/.test(learnerText));
    assert.ok(!learnerText.includes("permanentQlId"));
    assert.ok(!learnerText.includes("prototypeId"));
    assert.ok(!learnerText.includes("answerKey"));

    const words = learnerText.split(/\s+/u).filter(Boolean);
    assert.ok(words.length >= 45, `${entry.prototypeId}/${seed} lacks teaching detail.`);
    explanationWordCount += words.length;

    answerPositions[question.correctIndex] += 1;
    observedDifficulties.add(question.difficulty);
    observedRenderers.add(question.renderer);
    observedAnswerTypes.add(question.answerType);
    stemFingerprints.add(question.stem.toLocaleLowerCase("en-IN"));
    generatedCount += 1;
  }
}

assert.equal(generatedCount, 440);
assert.deepEqual(answerPositions, [110, 110, 110, 110]);
assert.deepEqual([...observedAuthorities].sort(), [...expectedAuthorities].sort());
assert.equal(observedPrototypes.size, 11);
assert.deepEqual([...observedDifficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...observedRenderers].sort(), ["FAMILY_TREE_EXPLANATION", "STRUCTURED_TEXT"]);
assert.equal(observedAnswerTypes.size, 6);
assert.ok(stemFingerprints.size >= 400, `Stem diversity is too low: ${stemFingerprints.size}/440.`);
assert.ok(explanationWordCount / generatedCount >= 70);

console.log("BLR-CP-001 English editorial readiness audit passed.", {
  generatedCount,
  answerPositions,
  prototypes: observedPrototypes.size,
  authorities: [...observedAuthorities].sort(),
  difficulties: [...observedDifficulties].sort(),
  renderers: [...observedRenderers].sort(),
  answerTypes: [...observedAnswerTypes].sort(),
  uniqueStems: stemFingerprints.size,
  averageLearnerWords: Math.round(explanationWordCount / generatedCount),
});
