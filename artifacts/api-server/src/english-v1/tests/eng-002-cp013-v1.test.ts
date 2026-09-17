import assert from "node:assert/strict";
import { cp013ScenePoolV1, rulesForDifficultyCp013V1 } from "../chapters/error-spotting/ENG-001/CP013/eng-001-cp013-v1";
import { buildEng002Cp013ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP013/eng-002-cp013-review-v1-export";
import { ENG002_CP013_STEM, generateEng002Cp013QuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP013/eng-002-cp013-v1";

function assertClean(q: ReturnType<typeof generateEng002Cp013QuestionV1>) {
  assert.equal(q.stem, ENG002_CP013_STEM);
  assert.equal(q.options.length, 4);
  assert.equal(q.options[3], "No improvement");
  assert.equal(new Set(q.options.map((option) => option.toLowerCase())).size, 4);
  assert.ok(q.correctOptionIndex >= 0 && q.correctOptionIndex <= 3);
  assert.equal(q.sentence.includes(" / "), false);
  assert.ok(q.targetText.trim().length > 0);
  assert.equal(q.segments[q.targetIndex]!.replace(/[,.;:!?]+$/, ""), q.targetText, "underlined segment must equal the focused replacement target");
  assert.match(q.explanation, /Concept:/);
  assert.match(q.explanation, /Here:/);
  assert.match(q.explanation, /Correct sentence:/);
  assert.equal(q.metadata.reviewOnly, true);
  if (q.metadata.ruleId === "GR-USG-003") {
    for (const option of q.options.slice(0, 3)) {
      assert.equal(/different\s+(?:to|than)\b/i.test(option), false, `dialect-valid different variant must not be keyed/distractor: ${option}`);
    }
  }
  if (q.metadata.ruleId === "GR-USG-006") {
    for (const option of q.options.slice(0, 3)) {
      assert.equal(/prevent\w*\s+.+?\s+to\s+\w+/i.test(option) && option === q.options[q.correctOptionIndex], false, `to-infinitive cannot be keyed correct: ${option}`);
    }
  }
  if (q.metadata.noImprovement) assert.equal(q.correctOptionIndex, 3); else assert.notEqual(q.correctOptionIndex, 3);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  assert.equal(cp013ScenePoolV1(difficulty).length, 20);
  const seenDomains = new Set<string>();
  const seenRules = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  for (let index = 0; index < 2000; index += 1) {
    const seed = `eng002-cp013-stress:${difficulty}:${index}`;
    const first = generateEng002Cp013QuestionV1({ seed, difficulty });
    assertClean(first);
    assert.deepEqual(generateEng002Cp013QuestionV1({ seed, difficulty }), first);
    seenDomains.add(first.metadata.semanticDomain);
    seenRules.add(first.metadata.ruleId);
    answerCounts[first.correctOptionIndex] += 1;
  }
  assert.ok(seenDomains.size >= 15, `${difficulty} reached only ${seenDomains.size} domains`);
  assert.deepEqual([...seenRules].sort(), [...rulesForDifficultyCp013V1(difficulty)].sort());
  assert.ok(answerCounts[3]! >= 350 && answerCounts[3]! <= 650, `${difficulty} no-improvement distribution ${answerCounts[3]}`);
  for (const position of [0, 1, 2]) assert.ok(answerCounts[position]! > 250, `${difficulty} answer position ${position} underused`);
  for (const ruleId of rulesForDifficultyCp013V1(difficulty)) {
    const scene = cp013ScenePoolV1(difficulty, ruleId)[0]!;
    for (const noImprovement of [false, true]) {
      const q = generateEng002Cp013QuestionV1({ seed: `eng002-cp013-rule:${difficulty}:${ruleId}:${noImprovement}`, difficulty, ruleId, sceneId: scene.id, noImprovement });
      assert.equal(q.metadata.ruleId, ruleId);
      assert.equal(q.metadata.noImprovement, noImprovement);
      assertClean(q);
    }
  }
}

const review = buildEng002Cp013ReviewV1();
assert.equal(review.length, 60);
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert.equal(slice.length, 20);
  assert.equal(slice.filter((item) => item.question.metadata.noImprovement).length, 5);
}
assert.equal(new Set(review.map((item) => item.question.metadata.ruleId)).size, 9);
assert.ok(new Set(review.map((item) => item.question.metadata.semanticDomain)).size >= 45);
review.forEach((item) => assertClean(item.question));
console.log("ENG-002 CP013 deterministic stress and review tests passed.");
