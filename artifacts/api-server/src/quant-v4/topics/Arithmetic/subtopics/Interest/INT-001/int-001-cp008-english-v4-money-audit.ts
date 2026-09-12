import type { Rational } from "./cp003-exam-model";
import { generateIntCp008EnglishQuestion } from "./cp008-instalment-english-v4";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function indianInteger(value: bigint): string {
  const source = value.toString();
  if (source.length <= 3) return source;
  const tail = source.slice(-3);
  let head = source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return `${groups.join(",")},${tail}`;
}

function nearestPaiseText(value: Rational): string {
  assert(value.numerator >= 0n && value.denominator > 0n, "invalid monetary Rational");
  const scaled = value.numerator * 100n;
  let paise = scaled / value.denominator;
  const remainder = scaled % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const paisePart = paise % 100n;
  return paisePart === 0n ? `₹${indianInteger(rupees)}` : `₹${indianInteger(rupees)}.${paisePart.toString().padStart(2, "0")}`;
}

function needsPaise(value: Rational): boolean {
  return (value.numerator * 100n) % value.denominator !== 0n;
}

let questions = 0;
let monetaryOptions = 0;
let exactRenderingChecks = 0;
let instructionChecks = 0;
let roundedCorrectAnswers = 0;
const roundedByQl = new Map<string, number>();

for (const qlId of INT_CP008_QL_IDS) {
  roundedByQl.set(qlId, 0);
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp008-english-v1:${qlId}:${index}`;
    const question = generateIntCp008EnglishQuestion(qlId, seed);
    questions += 1;

    const learnerText = [
      question.presentation.prompt,
      question.presentation.markdown,
      question.explanation.keyIdea,
      ...question.explanation.steps,
      question.explanation.finalAnswer,
      question.explanation.commonMistake,
      ...question.options.map((option) => option.text),
    ].join("\n");
    assert(!/₹\d+\/\d+/u.test(learnerText), `${qlId}/${seed}: raw rupee fraction remains`);
    assert(!/₹[\d,]+\.\d{3,}/u.test(learnerText), `${qlId}/${seed}: rupee display exceeds paise precision`);
    exactRenderingChecks += 2;

    if (question.answerSemantic !== "PERIODIC_RATE_PERCENT") {
      for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
        const option = question.options[optionIndex]!;
        assert(option.text === nearestPaiseText(option.value), `${qlId}/${seed}: option ${optionIndex + 1} display is not derived from exact Rational`);
        monetaryOptions += 1;
        exactRenderingChecks += 1;
      }
      const correctValue = question.options[question.correctIndex]!.value;
      const mustRound = needsPaise(correctValue);
      assert(question.presentation.prompt.includes("nearest paise") === mustRound, `${qlId}/${seed}: paise instruction mismatch`);
      assert(question.correctAnswer === nearestPaiseText(correctValue), `${qlId}/${seed}: correct-answer rendering drift`);
      assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: explanation answer rendering drift`);
      instructionChecks += 3;
      if (mustRound) {
        roundedCorrectAnswers += 1;
        roundedByQl.set(qlId, roundedByQl.get(qlId)! + 1);
      }
    } else {
      assert(!question.presentation.prompt.includes("nearest paise"), `${qlId}/${seed}: paise instruction leaked into rate question`);
      instructionChecks += 1;
    }
  }
}

assert(questions === 1800, `expected 1800 V4 money audit questions, got ${questions}`);
assert(roundedCorrectAnswers > 0, "V4 money audit did not exercise rounded correct answers");
assert(roundedByQl.get("INT-QL-124") === 200, `QL124 expected 200 rounded correct-answer states, got ${roundedByQl.get("INT-QL-124")}`);

console.log(JSON.stringify({
  questions,
  monetaryOptions,
  exactRenderingChecks,
  instructionChecks,
  roundedCorrectAnswers,
  roundedByQl: Object.fromEntries(roundedByQl),
  rawFractionalRupeesRemaining: 0,
  overPrecisionRupeesRemaining: 0,
  ql124RoundedCorrectAnswers: roundedByQl.get("INT-QL-124"),
}, null, 2));
console.log("PASS_INT_CP008_ENGLISH_V4_MONEY_AUDIT");
