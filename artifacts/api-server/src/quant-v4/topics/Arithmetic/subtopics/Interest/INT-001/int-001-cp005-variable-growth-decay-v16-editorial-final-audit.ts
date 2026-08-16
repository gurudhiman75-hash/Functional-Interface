import { INT_CP005_V16_QL_IDS, generateIntCp005QuestionV16EditorialFinal } from "./cp005-variable-growth-decay-runtime-v16-editorial-final";
import { verifyIntCp005Answer } from "./cp005-variable-growth-decay-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

let questions = 0;
let exactDistractorChecks = 0;
let optionChecks = 0;
let verifierChecks = 0;
for (const qlId of INT_CP005_V16_QL_IDS) {
  for (let index = 0; index < 160; index += 1) {
    const seed = `int-cp005-v16-editorial-final-audit-${qlId}-${index}`;
    const question = generateIntCp005QuestionV16EditorialFinal(qlId, seed);
    const replay = generateIntCp005QuestionV16EditorialFinal(qlId, seed);
    assert(stable(question) === stable(replay), `${qlId}/${seed}: editorial replay changed`);
    assert(verifyIntCp005Answer(question.mathematicalState, question.solution), `${qlId}/${seed}: verifier failed`);
    verifierChecks += 1;
    questions += 1;

    assert(question.options.length === 4, `${qlId}/${seed}: option count`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: duplicate option text`);
    assert(question.options.filter((option) => option.isCorrect).length === 1, `${qlId}/${seed}: correct ownership`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: answer mismatch`);
    optionChecks += 4;

    if (["INT-QL-086", "INT-QL-088", "INT-QL-091", "INT-QL-092"].includes(qlId)) {
      for (const option of question.options) {
        assert(option.value.denominator === 1n, `${qlId}/${seed}: non-integral option survived`);
        assert(option.value.numerator > 0n, `${qlId}/${seed}: non-positive option survived`);
        assert(option.value.numerator <= 300000n, `${qlId}/${seed}: option exceeds ₹3 lakh`);
        if (!option.isCorrect) {
          assert(option.misconceptionId !== "NEARBY_ARITHMETIC", `${qlId}/${seed}: synthetic nearby-arithmetic distractor survived`);
          assert(!/₹\d{2,},\d{2},\d{3}/u.test(option.text), `${qlId}/${seed}: crore-scale option survived`);
          exactDistractorChecks += 2;
        }
      }
    }
    if (qlId === "INT-QL-086") {
      assert(question.options.some((option) => !option.isCorrect && option.misconceptionId === "ADD_RATES"), `${qlId}/${seed}: additive-rate misconception missing`);
      const periodErrors = question.options.filter((option) => !option.isCorrect && (option.misconceptionId.startsWith("OMIT_YEAR_") || option.misconceptionId.startsWith("ONLY_YEAR_")));
      assert(periodErrors.length >= 2, `${qlId}/${seed}: exact period-selection distractors missing`);
      assert(periodErrors.some((option) => option.misconceptionId.startsWith("OMIT_YEAR_")), `${qlId}/${seed}: omission misconception missing`);
    }
    if (qlId === "INT-QL-088" || qlId === "INT-QL-091") {
      assert(question.options.some((option) => !option.isCorrect && option.misconceptionId === "NO_REVERSE"), `${qlId}/${seed}: no-reverse misconception missing`);
      assert(question.options.filter((option) => !option.isCorrect && option.misconceptionId.startsWith("REVERSE_ONLY_YEAR_")).length >= 2, `${qlId}/${seed}: one-factor reverse distractors missing`);
    }
    if (qlId === "INT-QL-092") {
      assert(question.options.every((option) => option.value.numerator <= 300000n), `${qlId}/${seed}: final amount cap failed`);
      assert(question.options.filter((option) => !option.isCorrect).every((option) => ["ADD_SIGNED_RATES", "ALL_INCREASE", "OMIT_LAST_CHANGE", "DECREASE_ON_ORIGINAL", "IGNORE_DECREASE", "IGNORE_INCREASE"].includes(option.misconceptionId)), `${qlId}/${seed}: unowned QL092 misconception survived`);
    }
  }
}

console.log(JSON.stringify({ questions, verifierChecks, optionChecks, exactDistractorChecks }, null, 2));
console.log("PASS_INT_CP005_V16_EDITORIAL_FINAL_DISTRACTORS");
