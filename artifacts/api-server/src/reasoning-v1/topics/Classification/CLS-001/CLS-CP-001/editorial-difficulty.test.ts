import assert from "node:assert/strict";
import { CLS_CP001_PROTOTYPES, ENTITY_BY_LABEL } from "./semantic-dataset.en";
import { generateClsCp001Prototype } from "./runtime";
import type { Difficulty, GeneratedClassificationQuestion } from "./types";

const FORBIDDEN_EDITORIAL_PHRASES = [
  /bounded competing-class audit/i,
  /resolved class/i,
  /admitted class/i,
  /quality level/i,
  /quality rank/i,
  /hierarchy depth/i,
  /winning class/i,
  /candidate rule/i,
  /support count/i,
  /classification audit/i,
  /internal identifier/i,
];

function fullLearnerText(question: GeneratedClassificationQuestion): string {
  return [
    question.stem,
    ...question.givens,
    ...question.options,
    ...question.explanation.coreRule,
    ...question.explanation.optionChecks,
    ...question.explanation.examSpeedShortcut,
    ...question.explanation.commonTraps,
  ].join("\n");
}

function expectedDifficulty(score: number): Difficulty {
  if (score <= 1) return "EASY";
  if (score <= 4) return "MEDIUM";
  return "HARD";
}

const difficultyCounts = new Map<Difficulty, number>([["EASY", 0], ["MEDIUM", 0], ["HARD", 0]]);
const scoreCounts = new Map<number, number>();
const profileDifficulties = new Map<string, Set<Difficulty>>();
const explanationFingerprints = new Set<string>();
let generatedCount = 0;
let parentAwareCount = 0;
let multiMembershipCount = 0;
let crossCuttingCount = 0;

for (const prototype of CLS_CP001_PROTOTYPES) {
  const difficulties = new Set<Difficulty>();
  profileDifficulties.set(prototype.prototypeId, difficulties);

  for (let seed = 0; seed < 120; seed += 1) {
    const question = generateClsCp001Prototype(prototype.prototypeId, seed);
    const learnerText = fullLearnerText(question);
    generatedCount += 1;

    for (const forbidden of FORBIDDEN_EDITORIAL_PHRASES) {
      assert.ok(!forbidden.test(learnerText), `${prototype.prototypeId} seed ${seed} leaked technical wording: ${forbidden}`);
    }
    assert.ok(!/[{}\[\]]/.test(question.explanation.coreRule.join(" ")), "Explanation must not expose structured-data punctuation");
    assert.ok(!/\b(?:undefined|null|NaN|Infinity)\b/.test(learnerText));
    assert.equal(question.difficulty, expectedDifficulty(question.difficultyFeatures.score));
    assert.ok(Number.isInteger(question.difficultyFeatures.score));
    assert.ok(question.difficultyFeatures.score >= 0);
    assert.ok(question.difficultyFeatures.hierarchyDepth >= 0);
    assert.ok(question.difficultyFeatures.candidateRuleCount >= 1);
    assert.ok(question.difficultyFeatures.multiMembershipItemCount >= 0);

    difficultyCounts.set(question.difficulty, difficultyCounts.get(question.difficulty)! + 1);
    scoreCounts.set(question.difficultyFeatures.score, (scoreCounts.get(question.difficultyFeatures.score) ?? 0) + 1);
    difficulties.add(question.difficulty);
    if (question.difficultyFeatures.allItemsShareParent) parentAwareCount += 1;
    if (question.difficultyFeatures.multiMembershipItemCount > 0) multiMembershipCount += 1;

    const coreText = question.explanation.coreRule.join(" ");
    assert.ok(coreText.includes(question.answer), "Core explanation must name the answer");

    if (question.task === "FIND_OUTLIER") {
      const positiveOptions = question.options.filter((_, index) => index !== question.correctIndex);
      assert.equal(positiveOptions.length, 3);
      for (const option of positiveOptions) {
        assert.ok(coreText.includes(option), `Core explanation must name positive option ${option}`);
      }
      assert.match(coreText, /odd one out/i);
      assert.ok(
        /No other relevant grouping points to a different option\.|A broader description also leads to the same odd item, so the answer does not change\./.test(coreText),
        "Outlier explanation must close competing-group reasoning naturally",
      );
    } else {
      for (const given of question.givens) {
        assert.ok(coreText.includes(given), `Core explanation must name given item ${given}`);
      }
      assert.match(coreText, /same specific group/i);
    }

    if (question.difficultyFeatures.allItemsShareParent) {
      assert.match(coreText, /broader group/i);
    }
    if (question.difficultyFeatures.crossCutting) {
      crossCuttingCount += 1;
      assert.equal(question.difficulty, "HARD");
      assert.ok(question.difficultyFeatures.score >= 5);
    }

    assert.equal(question.explanation.optionChecks.length, 4);
    for (const [index, optionCheck] of question.explanation.optionChecks.entries()) {
      assert.ok(optionCheck.includes(question.options[index]!), "Each option check must name its own option");
      assert.ok(optionCheck.includes(question.intendedClassLabel), "Each option check must name the tested group");
    }

    for (const label of [...question.givens, ...question.options]) {
      assert.ok(ENTITY_BY_LABEL.has(label.toLocaleLowerCase("en-IN")), `Unregistered displayed entity: ${label}`);
    }

    explanationFingerprints.add(JSON.stringify({
      prototypeId: question.prototypeId,
      coreRule: question.explanation.coreRule,
      optionChecks: question.explanation.optionChecks,
    }));
  }
}

assert.equal(generatedCount, 840);
assert.equal(explanationFingerprints.size, 840, "Every reviewed state must have a question-specific explanation trace");
assert.ok((difficultyCounts.get("EASY") ?? 0) > 0);
assert.ok((difficultyCounts.get("MEDIUM") ?? 0) > 0);
assert.ok((difficultyCounts.get("HARD") ?? 0) > 0);
assert.ok(scoreCounts.size >= 5, `Difficulty score range is too narrow: ${[...scoreCounts.keys()].join(", ")}`);
assert.ok(parentAwareCount > 250);
assert.ok(multiMembershipCount > 100);
assert.equal(crossCuttingCount, 120);
assert.ok(profileDifficulties.get("CLS-CP001-PROT-001")!.size >= 2);
assert.deepEqual(profileDifficulties.get("CLS-CP001-PROT-006"), new Set<Difficulty>(["HARD"]));

console.log("CLS-CP-001 editorial and instance-difficulty audit passed.", {
  generatedCount,
  difficultyCounts: Object.fromEntries(difficultyCounts),
  scoreCounts: Object.fromEntries([...scoreCounts.entries()].sort((left, right) => left[0] - right[0])),
  parentAwareCount,
  multiMembershipCount,
  crossCuttingCount,
  profileDifficulties: Object.fromEntries([...profileDifficulties].map(([id, values]) => [id, [...values].sort()])),
});
