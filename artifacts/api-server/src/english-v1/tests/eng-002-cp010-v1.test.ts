import assert from "node:assert/strict";
import { cp010ScenePoolV1, rulesForDifficultyCp010V1 } from "../chapters/error-spotting/ENG-001/CP010/eng-001-cp010-v1";
import { buildEng002Cp010ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP010/eng-002-cp010-review-v1-export";
import { ENG002_CP010_STEM, generateEng002Cp010QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP010/eng-002-cp010-v1";
import type { EnglishDifficulty } from "../core/types";

function verify(seed: string, difficulty: EnglishDifficulty) {
  const q = generateEng002Cp010QuestionV1({ seed, difficulty });
  assert.equal(q.stem, ENG002_CP010_STEM);
  assert.equal(q.options.length, 4);
  assert.equal(q.options[3], "No improvement");
  assert.equal(new Set(q.options.map((option) => option.toLowerCase())).size, 4);
  assert.ok(q.correctOptionIndex >= 0 && q.correctOptionIndex <= 3);
  assert.equal(q.sentence.includes(" / "), false);
  assert.ok(q.targetText.trim().length > 0);
  assert.match(q.explanation, /Concept:/);
  assert.match(q.explanation, /Here:/);
  assert.match(q.explanation, /Correct sentence:/);
  assert.equal(q.metadata.reviewOnly, true);
  q.options.slice(0, 3).forEach((option) => assert.equal(/\b(only|almost|nearly|even|usually|rarely|clearly|carefully)\s+\1\b/i.test(option), false));
  if (q.metadata.noImprovement) assert.equal(q.correctOptionIndex, 3); else assert.notEqual(q.correctOptionIndex, 3);
  return q;
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(cp010ScenePoolV1(difficulty).length, 20);
  const seenDomains = new Set<string>();
  const seenRules = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  for (let index = 0; index < 2000; index += 1) {
    const seed = `eng002-cp010-stress:${difficulty}:${index}`;
    const first = verify(seed, difficulty);
    assert.deepEqual(generateEng002Cp010QuestionV1({ seed, difficulty }), first);
    seenDomains.add(first.metadata.semanticDomain);
    seenRules.add(first.metadata.ruleId);
    answerCounts[first.correctOptionIndex] += 1;
  }
  assert.ok(seenDomains.size >= 15, `${difficulty} reached only ${seenDomains.size} domains`);
  assert.deepEqual([...seenRules].sort(), [...rulesForDifficultyCp010V1(difficulty)].sort());
  assert.ok(answerCounts[3]! >= 350 && answerCounts[3]! <= 650, `${difficulty} no-improvement distribution ${answerCounts[3]}`);
  for (const position of [0, 1, 2]) assert.ok(answerCounts[position]! > 250, `${difficulty} answer position ${position} underused`);
  for (const ruleId of rulesForDifficultyCp010V1(difficulty)) {
    const scene = cp010ScenePoolV1(difficulty, ruleId)[0]!;
    for (const noImprovement of [false, true]) {
      const q = generateEng002Cp010QuestionV1({ seed: `eng002-cp010-rule:${difficulty}:${ruleId}:${noImprovement}`, difficulty, ruleId, sceneId: scene.id, noImprovement });
      assert.equal(q.metadata.ruleId, ruleId);
      assert.equal(q.metadata.noImprovement, noImprovement);
      assert.equal(new Set(q.options.map((option) => option.toLowerCase())).size, 4);
    }
  }
}

const review = buildEng002Cp010ReviewV1();
assert.equal(review.length, 60);
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert.equal(slice.length, 20);
  assert.equal(slice.filter((item) => item.question.metadata.noImprovement).length, 5);
}
assert.equal(new Set(review.map((item) => item.question.metadata.ruleId)).size, 10);
assert.ok(new Set(review.map((item) => item.question.metadata.semanticDomain)).size >= 20);
assert.equal(review.every((item) => item.question.options.length === 4 && item.question.options[3] === "No improvement"), true);
assert.equal(review.every((item) => !item.question.sentence.includes(" / ")), true);
assert.equal(review.every((item) => item.question.explanation.includes("Concept:") && item.question.explanation.includes("Here:") && item.question.explanation.includes("Correct sentence:")), true);
console.log("ENG-002 CP010 deterministic stress and review tests passed.");
