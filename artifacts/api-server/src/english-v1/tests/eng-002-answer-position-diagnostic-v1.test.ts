import { strict as assert } from "node:assert";

import { generateQuestionStudioQuestions } from "../../question-studio/engine-registry";

const PACKAGE_ID = "english-eng002-sentence-improvement-v1" as const;
const CPS = Array.from({ length: 13 }, (_, index) => `ENG-002-CP${String(index + 1).padStart(3, "0")}`);
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const SAMPLES_PER_CELL = 50;

const freshCounts = () => ({ A: 0, B: 0, C: 0, D: 0 });
const overall = freshCounts();
const perCp = Object.fromEntries(CPS.map((cpId) => [cpId, freshCounts()]));
const perDifficulty = Object.fromEntries(DIFFICULTIES.map((difficulty) => [difficulty, freshCounts()]));
let total = 0;

for (const cpId of CPS) {
  for (const difficulty of DIFFICULTIES) {
    for (let index = 0; index < SAMPLES_PER_CELL; index += 1) {
      const result = await generateQuestionStudioQuestions({
        engineId: "language-v1",
        packageId: PACKAGE_ID,
        canonicalProblemId: cpId,
        patternId: cpId,
        language: "en",
        difficulty,
        count: 1,
        runtimeMode: "review-only",
        seed: `eng002-answer-position-diagnostic-v1:${cpId}:${difficulty}:${index}`,
      });
      assert.equal(result.questions.length, 1);
      const question = result.questions[0]!;
      const options = Array.isArray(question.options) ? question.options.map(String) : [];
      const correctIndex = Number(question.correctIndex ?? question.correct);
      assert.equal(options.length, 4, `${cpId}/${difficulty}/${index} option count drifted`);
      assert.equal(options[3], "No improvement", `${cpId}/${difficulty}/${index} lost permanent No improvement slot`);
      assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex <= 3, `${cpId}/${difficulty}/${index} invalid answer position ${correctIndex}`);
      const label = String.fromCharCode(65 + correctIndex) as keyof typeof overall;
      overall[label] += 1;
      perCp[cpId]![label] += 1;
      perDifficulty[difficulty]![label] += 1;
      total += 1;
    }
  }
}

assert.equal(total, CPS.length * DIFFICULTIES.length * SAMPLES_PER_CELL);
assert.equal(total, 1950);

const percentages = (counts: Record<string, number>) => {
  const denominator = Object.values(counts).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, Number((value * 100 / denominator).toFixed(2))]));
};
const overallPct = percentages(overall);
const perCpPct = Object.fromEntries(Object.entries(perCp).map(([key, value]) => [key, percentages(value)]));
const perDifficultyPct = Object.fromEntries(Object.entries(perDifficulty).map(([key, value]) => [key, percentages(value)]));

for (const label of ["A", "B", "C", "D"] as const) {
  assert.ok(overallPct[label]! >= 18 && overallPct[label]! <= 32, `Overall answer ${label} share ${overallPct[label]}% is exploitable`);
}
for (const difficulty of DIFFICULTIES) {
  for (const label of ["A", "B", "C", "D"] as const) {
    const share = perDifficultyPct[difficulty]![label]!;
    assert.ok(share >= 15 && share <= 35, `${difficulty} answer ${label} share ${share}% is too concentrated`);
  }
}
for (const cpId of CPS) {
  const shares = Object.values(perCpPct[cpId]!);
  const maximumShare = Math.max(...shares);
  const minimumShare = Math.min(...shares);
  assert.ok(maximumShare <= 45, `${cpId} has a predictable answer-position share of ${maximumShare}%`);
  assert.ok(minimumShare >= 8, `${cpId} barely uses one answer position (${minimumShare}%)`);
}

console.log(JSON.stringify({
  status: "PASS_ENG_002_ANSWER_POSITION_DIAGNOSTIC_V1_BALANCED",
  samplesPerCell: SAMPLES_PER_CELL,
  total,
  overall: { counts: overall, pct: overallPct },
  perDifficulty: Object.fromEntries(Object.entries(perDifficulty).map(([key, value]) => [key, { counts: value, pct: perDifficultyPct[key] }])),
  perCp: Object.fromEntries(Object.entries(perCp).map(([key, value]) => [key, { counts: value, pct: perCpPct[key] }])),
}, null, 2));
