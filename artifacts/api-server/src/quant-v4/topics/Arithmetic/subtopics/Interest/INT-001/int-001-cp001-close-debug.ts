import { generateIntCp001CloseDistractorEnglishQuestion } from "./cp001-close-distractor-runtime";

for (const seed of ["close-distractor-5", "close-distractor-13"]) {
  const question = generateIntCp001CloseDistractorEnglishQuestion("INT-QL-007", seed);
  console.log(JSON.stringify({
    seed,
    answerSemantic: question.answerSemantic,
    answerUnit: question.internalProvenance.answerUnit,
    correctIndex: question.correctIndex,
    correctOption: question.options[question.correctIndex],
    correctAudit: question.optionAudit[question.correctIndex],
    options: question.options,
    optionAudit: question.optionAudit,
    sourceParameters: question.sourceParameters,
  }, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2));
}
