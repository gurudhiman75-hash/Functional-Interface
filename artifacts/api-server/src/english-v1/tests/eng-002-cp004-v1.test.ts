import assert from "node:assert/strict";
import { cp004ScenePoolV1, rulesForDifficultyCp004V1 } from "../chapters/error-spotting/ENG-001/CP004/eng-001-cp004-v1";
import { buildEng002Cp004ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP004/eng-002-cp004-review-v1-export";
import { ENG002_CP004_STEM, generateEng002Cp004QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP004/eng-002-cp004-v1";
import type { EnglishDifficulty } from "../core/types";

function verifyQuestion(seed: string, difficulty: EnglishDifficulty) {
  const question = generateEng002Cp004QuestionV1({ seed, difficulty });
  assert.equal(question.stem, ENG002_CP004_STEM);
  assert.equal(question.options.length, 4);
  assert.equal(question.options[3], "No improvement");
  assert.equal(new Set(question.options.map((option) => option.toLowerCase())).size, 4);
  assert.ok(question.correctOptionIndex >= 0 && question.correctOptionIndex <= 3);
  assert.equal(question.sentence.includes(" / "), false);
  assert.ok(question.targetText.length > 0);
  assert.ok(question.explanation.includes("Correct sentence:"));
  assert.equal(question.metadata.reviewOnly, true);
  if (question.metadata.noImprovement) {
    assert.equal(question.correctOptionIndex, 3);
    assert.equal(question.sentence, question.correctedSentence);
    assert.equal(question.options.slice(0, 3).some((option) => option.toLowerCase() === question.targetText.toLowerCase()), false);
  } else {
    assert.notEqual(question.correctOptionIndex, 3);
    assert.notEqual(question.sentence, question.correctedSentence);
    assert.notEqual(question.options[question.correctOptionIndex]!.toLowerCase(), question.targetText.toLowerCase());
  }
  return question;
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(cp004ScenePoolV1(difficulty).length, 20);
  const seenDomains = new Set<string>();
  const seenRules = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  for (let index = 0; index < 2000; index += 1) {
    const seed = `eng002-cp004-stress:${difficulty}:${index}`;
    const first = verifyQuestion(seed, difficulty);
    const replay = generateEng002Cp004QuestionV1({ seed, difficulty });
    assert.deepEqual(replay, first);
    seenDomains.add(first.metadata.semanticDomain);
    seenRules.add(first.metadata.ruleId);
    answerCounts[first.correctOptionIndex] += 1;
  }
  assert.ok(seenDomains.size >= 15, `${difficulty} reached only ${seenDomains.size} semantic domains`);
  assert.deepEqual([...seenRules].sort(), [...rulesForDifficultyCp004V1(difficulty)].sort());
  assert.ok(answerCounts[3]! >= 350 && answerCounts[3]! <= 650, `${difficulty} no-improvement distribution is ${answerCounts[3]}`);
  for (const position of [0, 1, 2]) assert.ok(answerCounts[position]! > 250, `${difficulty} answer position ${position} is underused`);

  for (const ruleId of rulesForDifficultyCp004V1(difficulty)) {
    const scene = cp004ScenePoolV1(difficulty, ruleId)[0]!;
    for (const noImprovement of [false, true]) {
      const q = generateEng002Cp004QuestionV1({ seed: `eng002-cp004-rule:${difficulty}:${ruleId}:${noImprovement}`, difficulty, ruleId, sceneId: scene.id, noImprovement });
      assert.equal(q.metadata.ruleId, ruleId);
      assert.equal(q.metadata.noImprovement, noImprovement);
      assert.equal(new Set(q.options.map((option) => option.toLowerCase())).size, 4);
    }
  }
}

const review = buildEng002Cp004ReviewV1();
assert.equal(review.length, 60);
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert.equal(slice.length, 20);
  assert.equal(slice.filter((item) => item.question.metadata.noImprovement).length, 5);
}
assert.equal(new Set(review.map((item) => item.question.metadata.ruleId)).size, 10);
assert.equal(new Set(review.map((item) => item.question.metadata.semanticDomain)).size, 20);
assert.equal(review.every((item) => item.question.options.length === 4), true);
assert.equal(review.every((item) => item.question.options[3] === "No improvement"), true);
assert.equal(review.every((item) => !item.question.sentence.includes(" / ")), true);

console.log("ENG-002 CP004 deterministic stress and review tests passed.");
