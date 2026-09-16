import assert from "node:assert/strict";
import { cp011ScenePoolV1, rulesForDifficultyCp011V1 } from "../chapters/error-spotting/ENG-001/CP011/eng-001-cp011-v1";
import { buildEng002Cp011ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP011/eng-002-cp011-review-v1-export";
import { ENG002_CP011_STEM, generateEng002Cp011QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP011/eng-002-cp011-v1";
import type { EnglishDifficulty } from "../core/types";

function assertClean(q: ReturnType<typeof generateEng002Cp011QuestionV1>) {
  assert.equal(q.stem, ENG002_CP011_STEM);
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
  assert.equal(/\b(if|unless|had|should|were|would|will|could|might)\s+\1\b/i.test(q.options.slice(0, 3).join("\n")), false);
  if (q.metadata.noImprovement) assert.equal(q.correctOptionIndex, 3); else assert.notEqual(q.correctOptionIndex, 3);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(cp011ScenePoolV1(difficulty).length, 20);
  const seenDomains = new Set<string>();
  const seenRules = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  for (let index = 0; index < 2000; index += 1) {
    const seed = `eng002-cp011-stress:${difficulty}:${index}`;
    const first = generateEng002Cp011QuestionV1({ seed, difficulty });
    assertClean(first);
    assert.deepEqual(generateEng002Cp011QuestionV1({ seed, difficulty }), first);
    seenDomains.add(first.metadata.semanticDomain);
    seenRules.add(first.metadata.ruleId);
    answerCounts[first.correctOptionIndex] += 1;
  }
  assert.ok(seenDomains.size >= 15, `${difficulty} reached only ${seenDomains.size} domains`);
  assert.deepEqual([...seenRules].sort(), [...rulesForDifficultyCp011V1(difficulty)].sort());
  assert.ok(answerCounts[3]! >= 350 && answerCounts[3]! <= 650, `${difficulty} no-improvement distribution ${answerCounts[3]}`);
  for (const position of [0, 1, 2]) assert.ok(answerCounts[position]! > 250, `${difficulty} answer position ${position} underused`);
  for (const ruleId of rulesForDifficultyCp011V1(difficulty)) {
    const scene = cp011ScenePoolV1(difficulty, ruleId)[0]!;
    for (const noImprovement of [false, true]) {
      const q = generateEng002Cp011QuestionV1({ seed: `eng002-cp011-rule:${difficulty}:${ruleId}:${noImprovement}`, difficulty, ruleId, sceneId: scene.id, noImprovement });
      assert.equal(q.metadata.ruleId, ruleId);
      assert.equal(q.metadata.noImprovement, noImprovement);
      assertClean(q);
    }
  }
}

const review = buildEng002Cp011ReviewV1();
assert.equal(review.length, 60);
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert.equal(slice.length, 20);
  assert.equal(slice.filter((item) => item.question.metadata.noImprovement).length, 5);
}
assert.equal(new Set(review.map((item) => item.question.metadata.ruleId)).size, 10);
assert.ok(new Set(review.map((item) => item.question.metadata.semanticDomain)).size >= 20);
review.forEach((item) => assertClean(item.question));
console.log("ENG-002 CP011 deterministic stress and review tests passed.");
