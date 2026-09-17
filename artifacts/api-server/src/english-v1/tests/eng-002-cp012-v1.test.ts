import assert from "node:assert/strict";
import { cp012ScenePoolV1, rulesForDifficultyCp012V1 } from "../chapters/error-spotting/ENG-001/CP012/eng-001-cp012-v1";
import { buildEng002Cp012ReviewV1 } from "../chapters/sentence-improvement/ENG-002/CP012/eng-002-cp012-review-v1-export";
import { ENG002_CP012_STEM } from "../chapters/sentence-improvement/ENG-002/CP012/eng-002-cp012-v1";
import { generateEng002Cp012CuratedQuestionV1 } from "../chapters/sentence-improvement/ENG-002/CP012/eng-002-cp012-curated-v1";

function assertClean(q: ReturnType<typeof generateEng002Cp012CuratedQuestionV1>) {
  assert.equal(q.stem, ENG002_CP012_STEM);
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
  for (const option of q.options.slice(0, 3)) {
    assert.equal(/\b(was|were|is|are|has|have|had|will|would|can|could|may|might|must|should)\s+\1\b/i.test(option), false, `duplicated auxiliary: ${option}`);
    assert.equal(/\bhad\s+(?:qualify|complete|identify|finish|join)\b/i.test(option), false, `malformed perfect sequence: ${option}`);
    assert.equal(/\bwould\s+(?:qualified|completed|identified|finished|joined)\b/i.test(option), false, `malformed modal sequence: ${option}`);
  }
  if (q.metadata.noImprovement) assert.equal(q.correctOptionIndex, 3); else assert.notEqual(q.correctOptionIndex, 3);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const expectedScenes = difficulty === "easy" ? 20 : 24;
  assert.equal(cp012ScenePoolV1(difficulty).length, expectedScenes);
  const seenDomains = new Set<string>();
  const seenRules = new Set<string>();
  const answerCounts = [0, 0, 0, 0];
  for (let index = 0; index < 2000; index += 1) {
    const seed = `eng002-cp012-stress:${difficulty}:${index}`;
    const first = generateEng002Cp012CuratedQuestionV1({ seed, difficulty });
    assertClean(first);
    assert.deepEqual(generateEng002Cp012CuratedQuestionV1({ seed, difficulty }), first);
    seenDomains.add(first.metadata.semanticDomain);
    seenRules.add(first.metadata.ruleId);
    answerCounts[first.correctOptionIndex] += 1;
  }
  assert.ok(seenDomains.size >= (difficulty === "easy" ? 15 : 18), `${difficulty} reached only ${seenDomains.size} domains`);
  assert.deepEqual([...seenRules].sort(), [...rulesForDifficultyCp012V1(difficulty)].sort());
  assert.ok(answerCounts[3]! >= 350 && answerCounts[3]! <= 650, `${difficulty} no-improvement distribution ${answerCounts[3]}`);
  for (const position of [0, 1, 2]) assert.ok(answerCounts[position]! > 250, `${difficulty} answer position ${position} underused`);
  for (const ruleId of rulesForDifficultyCp012V1(difficulty)) {
    const scene = cp012ScenePoolV1(difficulty, ruleId)[0]!;
    for (const noImprovement of [false, true]) {
      const q = generateEng002Cp012CuratedQuestionV1({ seed: `eng002-cp012-rule:${difficulty}:${ruleId}:${noImprovement}`, difficulty, ruleId, sceneId: scene.id, noImprovement });
      assert.equal(q.metadata.ruleId, ruleId);
      assert.equal(q.metadata.noImprovement, noImprovement);
      assertClean(q);
    }
  }
}

const review = buildEng002Cp012ReviewV1();
assert.equal(review.length, 68);
for (const [difficulty, expectedCount, expectedNi] of [["easy", 20, 5], ["medium", 24, 6], ["hard", 24, 6]] as const) {
  const slice = review.filter((item) => item.difficulty === difficulty);
  assert.equal(slice.length, expectedCount);
  assert.equal(slice.filter((item) => item.question.metadata.noImprovement).length, expectedNi);
}
assert.equal(new Set(review.map((item) => item.question.metadata.ruleId)).size, 12);
assert.ok(new Set(review.map((item) => item.question.metadata.semanticDomain)).size >= 50);
review.forEach((item) => assertClean(item.question));
console.log("ENG-002 CP012 deterministic stress and review tests passed.");
