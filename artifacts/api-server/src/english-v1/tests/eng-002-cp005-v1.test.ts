import assert from "node:assert/strict";
import { cp005ScenePoolV1, rulesForDifficultyCp005V1 } from "../chapters/error-spotting/ENG-001/CP005/eng-001-cp005-v1";
import { buildEng002Cp005ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP005/eng-002-cp005-review-v1-export";
import { ENG002_CP005_STEM, generateEng002Cp005QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP005/eng-002-cp005-v1";
import type { EnglishDifficulty } from "../core/types";

function verify(seed: string, difficulty: EnglishDifficulty) {
  const q = generateEng002Cp005QuestionV1({ seed, difficulty });
  assert.equal(q.stem, ENG002_CP005_STEM);
  assert.equal(q.options.length, 4);
  assert.equal(q.options[3], "No improvement");
  assert.equal(new Set(q.options.map((x) => x.toLowerCase())).size, 4);
  assert.ok(q.correctOptionIndex >= 0 && q.correctOptionIndex <= 3);
  assert.equal(q.sentence.includes(" / "), false);
  assert.ok(q.targetText.length > 0);
  assert.ok(q.explanation.includes("Correct sentence:"));
  assert.equal(q.metadata.reviewOnly, true);
  if (q.metadata.noImprovement) assert.equal(q.correctOptionIndex, 3);
  else assert.notEqual(q.correctOptionIndex, 3);
  return q;
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(cp005ScenePoolV1(difficulty).length, 20);
  const domains = new Set<string>();
  const rules = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  for (let i = 0; i < 2000; i += 1) {
    const seed = `eng002-cp005-stress:${difficulty}:${i}`;
    const first = verify(seed, difficulty);
    const replay = generateEng002Cp005QuestionV1({ seed, difficulty });
    assert.deepEqual(replay, first);
    domains.add(first.metadata.semanticDomain);
    rules.add(first.metadata.ruleId);
    answerCounts[first.correctOptionIndex] += 1;
  }
  assert.ok(domains.size >= 15, `${difficulty} reached only ${domains.size} domains`);
  assert.deepEqual([...rules].sort(), [...rulesForDifficultyCp005V1(difficulty)].sort());
  assert.ok(answerCounts[3]! >= 350 && answerCounts[3]! <= 650, `${difficulty} No-improvement distribution ${answerCounts[3]}`);
  for (const position of [0, 1, 2]) assert.ok(answerCounts[position]! > 250, `${difficulty} answer position ${position} underused`);
  for (const ruleId of rulesForDifficultyCp005V1(difficulty)) {
    const scene = cp005ScenePoolV1(difficulty, ruleId)[0]!;
    for (const noImprovement of [false, true]) {
      const q = generateEng002Cp005QuestionV1({ seed: `eng002-cp005-rule:${difficulty}:${ruleId}:${noImprovement}`, difficulty, ruleId, sceneId: scene.id, noImprovement });
      assert.equal(q.metadata.ruleId, ruleId);
      assert.equal(q.metadata.noImprovement, noImprovement);
      assert.equal(new Set(q.options.map((x) => x.toLowerCase())).size, 4);
    }
  }
}

const review = buildEng002Cp005ReviewV1();
assert.equal(review.length, 60);
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert.equal(slice.length, 20);
  assert.equal(slice.filter((item) => item.question.metadata.noImprovement).length, 5);
}
assert.equal(new Set(review.map((item) => item.question.metadata.ruleId)).size, 10);
assert.ok(new Set(review.map((item) => item.question.metadata.semanticDomain)).size >= 20);
assert.equal(review.every((item) => !item.question.sentence.includes(" / ")), true);
assert.equal(review.every((item) => item.question.options[3] === "No improvement"), true);

console.log("ENG-002 CP005 deterministic stress and review tests passed.");
