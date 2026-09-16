import assert from "node:assert/strict";
import { cp006ScenePoolV1, rulesForDifficultyCp006V1 } from "../chapters/error-spotting/ENG-001/CP006/eng-001-cp006-v1";
import { buildEng002Cp006ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP006/eng-002-cp006-review-v1-export";
import { ENG002_CP006_STEM, generateEng002Cp006QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP006/eng-002-cp006-v1";
import type { EnglishDifficulty } from "../core/types";

const bannedFabrications = /\b(?:gooder|badder|goodest|baddest|wellly|carefuly|clearerest)\b/i;

function verify(seed: string, difficulty: EnglishDifficulty) {
  const question = generateEng002Cp006QuestionV1({ seed, difficulty });
  assert.equal(question.stem, ENG002_CP006_STEM);
  assert.equal(question.options.length, 4);
  assert.equal(question.options[3], "No improvement");
  assert.equal(new Set(question.options.map((option) => option.toLowerCase())).size, 4);
  assert.ok(question.correctOptionIndex >= 0 && question.correctOptionIndex <= 3);
  assert.equal(question.sentence.includes(" / "), false);
  assert.ok(question.targetText.trim().length > 0);
  assert.equal(bannedFabrications.test(question.options.join(" ")), false);
  assert.match(question.explanation, /Concept:/);
  assert.match(question.explanation, /Here:/);
  assert.match(question.explanation, /Correct sentence:/);
  assert.equal(question.metadata.reviewOnly, true);
  if (question.metadata.noImprovement) assert.equal(question.correctOptionIndex, 3);
  else assert.notEqual(question.correctOptionIndex, 3);
  return question;
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(cp006ScenePoolV1(difficulty).length, 20);
  const seenDomains = new Set<string>();
  const seenRules = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  for (let index = 0; index < 2000; index += 1) {
    const seed = `eng002-cp006-stress:${difficulty}:${index}`;
    const first = verify(seed, difficulty);
    const replay = generateEng002Cp006QuestionV1({ seed, difficulty });
    assert.deepEqual(replay, first);
    seenDomains.add(first.metadata.semanticDomain);
    seenRules.add(first.metadata.ruleId);
    answerCounts[first.correctOptionIndex] += 1;
  }
  assert.ok(seenDomains.size >= 15, `${difficulty} reached only ${seenDomains.size} semantic domains`);
  assert.deepEqual([...seenRules].sort(), [...rulesForDifficultyCp006V1(difficulty)].sort());
  assert.ok(answerCounts[3]! >= 350 && answerCounts[3]! <= 650, `${difficulty} no-improvement distribution is ${answerCounts[3]}`);
  for (const position of [0, 1, 2]) assert.ok(answerCounts[position]! > 250, `${difficulty} answer position ${position} is underused`);

  for (const ruleId of rulesForDifficultyCp006V1(difficulty)) {
    const scene = cp006ScenePoolV1(difficulty, ruleId)[0]!;
    for (const noImprovement of [false, true]) {
      const question = generateEng002Cp006QuestionV1({
        seed: `eng002-cp006-rule:${difficulty}:${ruleId}:${noImprovement}`,
        difficulty,
        ruleId,
        sceneId: scene.id,
        noImprovement,
      });
      assert.equal(question.metadata.ruleId, ruleId);
      assert.equal(question.metadata.noImprovement, noImprovement);
      assert.equal(new Set(question.options.map((option) => option.toLowerCase())).size, 4);
      assert.equal(bannedFabrications.test(question.options.join(" ")), false);
    }
  }
}

const review = buildEng002Cp006ReviewV1();
assert.equal(review.length, 60);
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert.equal(slice.length, 20);
  assert.equal(slice.filter((item) => item.question.metadata.noImprovement).length, 5);
}
assert.equal(new Set(review.map((item) => item.question.metadata.ruleId)).size, 10);
assert.ok(new Set(review.map((item) => item.question.metadata.semanticDomain)).size >= 20);
assert.equal(review.every((item) => item.question.options.length === 4), true);
assert.equal(review.every((item) => item.question.options[3] === "No improvement"), true);
assert.equal(review.every((item) => !item.question.sentence.includes(" / ")), true);
assert.equal(review.every((item) => item.question.explanation.includes("Concept:") && item.question.explanation.includes("Here:") && item.question.explanation.includes("Correct sentence:")), true);
assert.equal(review.every((item) => !bannedFabrications.test(item.question.options.join(" "))), true);

console.log("ENG-002 CP006 deterministic stress and review tests passed.");
