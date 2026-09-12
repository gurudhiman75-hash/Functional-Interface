import type { Rational } from "./cp003-exam-model";
import { generateIntCp008EnglishQuestion as generateV3 } from "./cp008-instalment-english-v3";
import { generateIntCp008EnglishQuestion as generateV2 } from "./cp008-instalment-english-v2";
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
  assert(value.numerator >= 0n && value.denominator > 0n, "money rational must be non-negative");
  const scaled = value.numerator * 100n;
  let paise = scaled / value.denominator;
  const remainder = scaled % value.denominator;
  if (remainder * 2n >= value.denominator) paise += 1n;
  const rupees = paise / 100n;
  const paisePart = paise % 100n;
  return paisePart === 0n
    ? `₹${indianInteger(rupees)}`
    : `₹${indianInteger(rupees)}.${paisePart.toString().padStart(2, "0")}`;
}

function learnerText(question: ReturnType<typeof generateV2>): string {
  return [
    question.presentation.prompt,
    question.presentation.markdown,
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
    question.explanation.commonMistake,
    ...question.options.map((option) => option.text),
  ].join("\n");
}

function needsRounding(text: string): boolean {
  return /₹\d+\/\d+/u.test(text) || /₹[\d,]+\.\d{3,}/u.test(text);
}

let questions = 0;
let monetaryOptions = 0;
let nearestPaiseChecks = 0;
let roundedQuestions = 0;
const roundedByQl = new Map<string, number>();

for (const qlId of INT_CP008_QL_IDS) {
  roundedByQl.set(qlId, 0);
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp008-english-v1:${qlId}:${index}`;
    const source = generateV2(qlId, seed);
    const question = generateV3(qlId, seed);
    const sourceText = learnerText(source);
    const currentText = learnerText(question as any);
    const sourceNeedsRounding = needsRounding(sourceText);
    questions += 1;

    assert(!/₹\d+\/\d+/u.test(currentText), `${qlId}/${seed}: raw rupee fraction remains`);
    assert(!/₹[\d,]+\.\d{3,}/u.test(currentText), `${qlId}/${seed}: rupee display exceeds paise precision`);
    nearestPaiseChecks += 2;

    if (sourceNeedsRounding) {
      assert(question.presentation.prompt.includes("nearest paise"), `${qlId}/${seed}: rounding instruction missing`);
      roundedQuestions += 1;
      roundedByQl.set(qlId, roundedByQl.get(qlId)! + 1);
      nearestPaiseChecks += 1;
    }

    if (question.answerSemantic !== "PERIODIC_RATE_PERCENT") {
      for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
        const option = question.options[optionIndex]!;
        assert(option.text === nearestPaiseText(option.value), `${qlId}/${seed}: option ${optionIndex + 1} is not nearest-paise exact`);
        monetaryOptions += 1;
        nearestPaiseChecks += 1;
      }
      assert(question.correctAnswer === nearestPaiseText(question.options[question.correctIndex]!.value), `${qlId}/${seed}: correct answer rendering drift`);
      assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: explanation final answer rendering drift`);
      nearestPaiseChecks += 2;
    }
  }
}

assert(questions === 1800, `expected 1800 V3 money audit questions, got ${questions}`);
assert(roundedQuestions > 0, "expected non-paise source states to be remediated");
assert((roundedByQl.get("INT-QL-124") ?? 0) > 0, "QL124 rounding remediation was not exercised");

console.log(JSON.stringify({
  questions,
  monetaryOptions,
  nearestPaiseChecks,
  roundedQuestions,
  roundedByQl: Object.fromEntries(roundedByQl),
  rawFractionalRupeesRemaining: 0,
  overPrecisionRupeesRemaining: 0,
}, null, 2));
console.log("PASS_INT_CP008_ENGLISH_V3_MONEY_AUDIT");
