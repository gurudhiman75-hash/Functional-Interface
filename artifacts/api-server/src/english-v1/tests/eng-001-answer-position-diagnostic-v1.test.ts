import { strict as assert } from "node:assert";
import { generateQuestionStudioQuestions } from "../../question-studio/engine-registry";

const CPS = Array.from({ length: 13 }, (_, index) => `ENG-001-CP${String(index + 1).padStart(3, "0")}`);
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const QLS = ["ENG-001-QL001", "ENG-001-QL002"] as const;
const SAMPLES_PER_CELL = 50;

const freshCounts = () => ({ A: 0, B: 0, C: 0, D: 0 });
const overall = freshCounts();
const perCp = Object.fromEntries(CPS.map((cpId) => [cpId, freshCounts()]));
const perQl = Object.fromEntries(QLS.map((qlId) => [qlId, freshCounts()]));
let total = 0;

for (const cpId of CPS) {
  for (const difficulty of DIFFICULTIES) {
    for (const qlId of QLS) {
      for (let index = 0; index < SAMPLES_PER_CELL; index += 1) {
        const result = await generateQuestionStudioQuestions({
          engineId: "language-v1",
          packageId: "ENG-001",
          canonicalProblemId: cpId,
          patternId: qlId,
          language: "en",
          difficulty,
          count: 1,
          runtimeMode: "review-only",
          seed: `eng001-answer-position-diagnostic-v1:${cpId}:${difficulty}:${qlId}:${index}`,
        });
        assert.equal(result.questions.length, 1);
        const question = result.questions[0]!;
        const correctIndex = Number(question.correctIndex ?? question.correct);
        assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex <= 3, `${cpId}/${difficulty}/${qlId} returned invalid error position ${correctIndex}`);
        const label = String.fromCharCode(65 + correctIndex) as keyof typeof overall;
        overall[label] += 1;
        perCp[cpId]![label] += 1;
        perQl[qlId]![label] += 1;
        total += 1;
      }
    }
  }
}

assert.equal(total, CPS.length * DIFFICULTIES.length * QLS.length * SAMPLES_PER_CELL);

const percentages = (counts: Record<string, number>) => {
  const denominator = Object.values(counts).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, Number((value * 100 / denominator).toFixed(2))]));
};

console.log(JSON.stringify({
  status: "PASS_ENG_001_ANSWER_POSITION_DIAGNOSTIC_V1",
  samplesPerCell: SAMPLES_PER_CELL,
  total,
  overall,
  overallPct: percentages(overall),
  perQl: Object.fromEntries(Object.entries(perQl).map(([key, value]) => [key, { counts: value, pct: percentages(value) }])),
  perCp: Object.fromEntries(Object.entries(perCp).map(([key, value]) => [key, { counts: value, pct: percentages(value) }])),
}, null, 2));
