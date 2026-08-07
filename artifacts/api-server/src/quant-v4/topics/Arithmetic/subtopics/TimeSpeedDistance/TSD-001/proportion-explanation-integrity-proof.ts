import { toMixedString } from "./foundation/rational";
import { generateFinalAuthorityReview } from "./final-authority-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameRational(
  first: { readonly numerator: bigint; readonly denominator: bigint },
  second: { readonly numerator: bigint; readonly denominator: bigint },
): boolean {
  return first.numerator === second.numerator && first.denominator === second.denominator;
}

const records = generateFinalAuthorityReview();
const questions = records
  .map((record) => record.sourceQuestion)
  .filter((question) => question.checkpointId === "TSD-CP-001")
  .filter((question) => question.solveMode === "distanceByProportion" || question.solveMode === "timeByProportion");

assert(questions.length === 10, "Expected ten final reference-trip review questions");

let changedSpeedRows = 0;
const verifiedOperations: string[] = [];

for (const question of questions) {
  assert(question.validation.valid, `${question.seed}: source validation failed`);
  assert(question.options[question.correctIndex] === question.answerText, `${question.seed}: answer key mismatch`);
  assert(question.explanation.optionAnalysis.length === 4, `${question.seed}: incomplete option analysis`);
  assert(question.explanation.optionAnalysis.every((entry) => entry.reason.includes(entry.text)), `${question.seed}: option reason is not value-specific`);

  const explanationText = [
    question.explanation.keyRule,
    question.explanation.concept,
    question.explanation.shortcut,
    question.explanation.trap,
    ...question.explanation.working,
    ...question.explanation.stepByStepSolution,
    ...question.explanation.optionAnalysis.map((entry) => entry.reason),
  ].join(" ");

  const input = question.input;
  const changedSpeed = !sameRational(input.knownSpeed, input.targetSpeed);
  if (changedSpeed) {
    changedSpeedRows += 1;
    assert(!/speed remains unchanged|unchanged speed|keeps? the same speed|same speed carried|speed found from the original trip/i.test(explanationText), `${question.seed}: changed-speed question still claims an unchanged speed`);
  }

  const working = question.explanation.working.join(" ");
  const steps = question.explanation.stepByStepSolution.join(" ");
  const correctReason = question.explanation.optionAnalysis.find((entry) => entry.isCorrect)?.reason ?? "";

  if (input.solveMode === "distanceByProportion") {
    const operation = `${toMixedString(input.targetSpeed)} × ${toMixedString(input.targetTime)}`;
    assert(working.includes(operation), `${question.seed}: working does not use target speed × target time (${operation})`);
    assert(working.includes(question.answerText), `${question.seed}: working does not reach ${question.answerText}`);
    assert(steps.includes(toMixedString(input.targetSpeed)), `${question.seed}: learner steps omit the target speed`);
    assert(correctReason.includes(toMixedString(input.targetSpeed)) && correctReason.includes(question.answerText), `${question.seed}: correct-option reason does not prove the target-speed result`);
    verifiedOperations.push(`${question.seed}: ${operation} = ${question.answerText}`);
    continue;
  }

  const operation = `${toMixedString(input.targetDistance)} ÷ ${toMixedString(input.targetSpeed)}`;
  assert(working.includes(operation), `${question.seed}: working does not use target distance ÷ target speed (${operation})`);
  assert(working.includes(question.answerText), `${question.seed}: working does not reach ${question.answerText}`);
  assert(steps.includes(toMixedString(input.targetSpeed)), `${question.seed}: learner steps omit the target speed`);
  assert(correctReason.includes(toMixedString(input.targetSpeed)) && correctReason.includes(question.answerText), `${question.seed}: correct-option reason does not prove the target-speed result`);
  verifiedOperations.push(`${question.seed}: ${operation} = ${question.answerText}`);
}

assert(changedSpeedRows === 8, "Expected eight changed-speed reference-trip questions");

const requiredSeeds = new Map([
  ["review:TSD-CP001-DISC-017:1", "90 × 5 = 450 km"],
  ["review:TSD-CP001-DISC-017:2", "40 × 6 = 240 km"],
  ["p2-b02:reference-distance:707", "36 × 4 = 144 km"],
  ["p2-b02:reference-distance:712", "67 1/2 × 4 = 270 km"],
  ["review:TSD-CP001-DISC-018:1", "270 ÷ 67 1/2 = 4 hours"],
  ["review:TSD-CP001-DISC-018:2", "180 ÷ 48 = 3.75 hours"],
  ["p2-b02:reference-time:901", "240 ÷ 90 = 8/3 hours"],
  ["p2-b02:reference-time:904", "150 ÷ 75 = 2 hours"],
]);

for (const [seed, expected] of requiredSeeds) {
  const operation = verifiedOperations.find((entry) => entry.startsWith(`${seed}: `));
  assert(operation?.endsWith(expected), `${seed}: expected ${expected}, received ${operation ?? "missing"}`);
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "PROPORTION_EXPLANATION_INTEGRITY",
  referenceTripQuestions: questions.length,
  changedSpeedQuestions: changedSpeedRows,
  verifiedOperations,
  permanentQlIdsAssigned: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
