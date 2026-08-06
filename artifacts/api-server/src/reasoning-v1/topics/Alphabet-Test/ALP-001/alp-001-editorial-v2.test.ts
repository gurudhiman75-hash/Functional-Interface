import { ALP_001_QLS } from "./ql-registry";
import { generateAlp001Question } from "./runtime";
import type { AlpAnswerType, AlpLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function learnerText(question: ReturnType<typeof generateAlp001Question>): string {
  return [
    question.explanation.coreConcept,
    question.explanation.ruleStatement,
    ...question.explanation.steps,
    ...question.explanation.visualWorking,
    question.explanation.examShortcut,
    question.explanation.conclusion,
    ...question.explanation.distractorAnalyses.map((analysis) => analysis.explanation),
  ].join("\n");
}
function instructionalText(question: ReturnType<typeof generateAlp001Question>): string {
  const protectedTokens = [
    question.answer,
    question.structuredPrompt.word ?? "",
    question.structuredPrompt.transformedWord ?? "",
    ...(question.structuredPrompt.sequence ?? []),
    ...(question.structuredPrompt.transformedSequence ?? []),
    ...question.options.map((option) => option.value),
  ].filter((token) => token.length > 0).sort((first, second) => second.length - first.length);
  const withoutProtectedData = protectedTokens.reduce((current, token) => current.split(token).join(""), learnerText(question));
  return withoutProtectedData.replace(/\b[A-Z]{2,}\b/g, "");
}
function optionMatchesAnswerType(answerType: AlpAnswerType, value: string, locale: AlpLocale): boolean {
  switch (answerType) {
    case "LETTER": return /^[A-Z]$/.test(value);
    case "NUMBER": return /^\d+$/.test(value);
    case "NUMBER_PAIR": return /^\d+\s*,\s*\d+$/.test(value);
    case "LETTER_PAIR": return /^[A-Z]\s*(?:,|:)\s*[A-Z]$/.test(value);
    case "PAIR_SELECTION": return /^[A-Z]\s*:\s*[A-Z]$/.test(value);
    case "TOKEN": return /^[A-Z0-9@#$%&*+?]$/.test(value);
    case "TOKEN_PAIR": return /^[A-Z0-9@#$%&*+?]\s*:\s*[A-Z0-9@#$%&*+?]$/.test(value);
    case "TOKEN_SEQUENCE": return /^[A-Z0-9@#$%&*+?]+$/.test(value);
    case "DIRECTION_OFFSET":
      if (locale === "en-IN") return /^\d+ to the (?:left|right)$/.test(value);
      if (locale === "hi-IN") return /^\d+ स्थान (?:बाईं|दाईं) ओर$/.test(value);
      return /^\d+ (?:ਥਾਂ|ਥਾਵਾਂ) (?:ਖੱਬੇ|ਸੱਜੇ) ਪਾਸੇ$/.test(value);
    case "LETTER_SET":
      if (locale === "en-IN") return value === "None" || /^(?:(?:first|second|third|\d+th) [A-Z])(?:; (?:first|second|third|\d+th) [A-Z])*$/.test(value);
      if (locale === "hi-IN") return value === "कोई नहीं" || /^(?:(?:पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|\d+वाँ) [A-Z])(?:; (?:पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|\d+वाँ) [A-Z])*$/.test(value);
      return value === "ਕੋਈ ਨਹੀਂ" || /^(?:(?:ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|\d+ਵਾਂ) [A-Z])(?:; (?:ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|\d+ਵਾਂ) [A-Z])*$/.test(value);
  }
}

const locales: readonly AlpLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const englishInstructionLeak = /\b(?:left|right|rank|position|answer|original|changed|distance|move|apply|starting|required|result|letter|word|count|step|therefore|row|digit|symbol)\b/i;
const rejectedInternal = /undefined|null|\{\{|\}\}|ALP_|WORD_TRANSFORM_|ALPHA_TRANSFORM_|COMPLETION_TRAP_/;
const rejectedPunjabi = /ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਸਦ੍ਰਿਸ਼ਤਾ/;
let generated = 0;
let localized = 0;
let traps = 0;
let answerShapeChecks = 0;
let completionVisualChecks = 0;
const solveModes = new Set<string>();

for (const ql of ALP_001_QLS) {
  for (let seed = 0; seed < 12; seed += 1) {
    for (const locale of locales) {
      const question = generateAlp001Question(ql.qlId, seed, locale);
      generated += 1;
      if (locale !== "en-IN") localized += 1;
      solveModes.add(ql.solveMode);

      assert(question.metadata.runtimeVersion === "ALP-001-RUNTIME-V3", `${ql.qlId} ${seed} ${locale} runtime version`);
      assert(question.explanation.schemaVersion === "ALP-001-PEDAGOGY-V2", `${ql.qlId} ${seed} ${locale} pedagogy schema`);
      assert(question.explanation.coreConcept.length >= 45, `${ql.qlId} ${seed} ${locale} weak core concept`);
      assert(question.explanation.ruleStatement.length >= 35, `${ql.qlId} ${seed} ${locale} weak rule statement`);
      assert(question.explanation.steps.length >= 2, `${ql.qlId} ${seed} ${locale} insufficient worked steps`);
      assert(question.explanation.visualWorking.length >= 1, `${ql.qlId} ${seed} ${locale} missing visual working`);
      assert(question.explanation.examShortcut.length >= 25, `${ql.qlId} ${seed} ${locale} weak shortcut`);
      assert(question.explanation.conclusion.includes(question.answer), `${ql.qlId} ${seed} ${locale} conclusion omits answer`);
      assert(question.options[question.correctIndex]?.value === question.answer, `${ql.qlId} ${seed} ${locale} answer mismatch`);
      assert(question.options.length === 4 && new Set(question.options.map((option) => option.value)).size === 4, `${ql.qlId} ${seed} ${locale} invalid options`);
      assert(question.options.filter((option) => option.errorLabel === null).length === 1, `${ql.qlId} ${seed} ${locale} correct marker count`);
      assert(question.explanation.distractorAnalyses.length === 3, `${ql.qlId} ${seed} ${locale} trap count`);
      assert(new Set(question.explanation.distractorAnalyses.map((analysis) => analysis.explanation)).size === 3, `${ql.qlId} ${seed} ${locale} duplicate traps`);

      for (const option of question.options) {
        answerShapeChecks += 1;
        assert(optionMatchesAnswerType(ql.answerType, option.value, locale), `${ql.qlId} ${seed} ${locale} ${ql.answerType} option mismatch: ${option.value}`);
      }
      const wrongIndices = question.options.map((_, index) => index).filter((index) => index !== question.correctIndex).sort();
      const analysedIndices = question.explanation.distractorAnalyses.map((analysis) => analysis.optionIndex).sort();
      assert(JSON.stringify(wrongIndices) === JSON.stringify(analysedIndices), `${ql.qlId} ${seed} ${locale} trap index mismatch`);
      for (const analysis of question.explanation.distractorAnalyses) {
        traps += 1;
        assert(question.options[analysis.optionIndex]?.value === analysis.optionValue, `${ql.qlId} ${seed} ${locale} trap value mismatch`);
        assert(analysis.explanation.includes(analysis.optionValue), `${ql.qlId} ${seed} ${locale} trap omits option value`);
        assert(!/COMPLETION_TRAP_/.test(analysis.explanation), `${ql.qlId} ${seed} ${locale} trap leaks internal label`);
      }

      const fullText = `${question.stem}\n${learnerText(question)}`;
      assert(!rejectedInternal.test(fullText), `${ql.qlId} ${seed} ${locale} unresolved or internal learner text`);
      if (locale === "hi-IN") {
        assert(/[\u0900-\u097F]/.test(question.stem), `${ql.qlId} ${seed} Hindi stem missing script`);
        assert(/[\u0900-\u097F]/.test(question.explanation.coreConcept), `${ql.qlId} ${seed} Hindi explanation missing script`);
        assert(!englishInstructionLeak.test(instructionalText(question)), `${ql.qlId} ${seed} English leak in Hindi explanation`);
      }
      if (locale === "pa-IN") {
        assert(/[\u0A00-\u0A7F]/.test(question.stem), `${ql.qlId} ${seed} Punjabi stem missing script`);
        assert(/[\u0A00-\u0A7F]/.test(question.explanation.coreConcept), `${ql.qlId} ${seed} Punjabi explanation missing script`);
        assert(!englishInstructionLeak.test(instructionalText(question)), `${ql.qlId} ${seed} English leak in Punjabi explanation`);
        assert(!rejectedPunjabi.test(fullText), `${ql.qlId} ${seed} rejected Punjabi terminology`);
      }
      if (Number(ql.checkpointId.slice(-3)) >= 6) {
        completionVisualChecks += 1;
        assert(question.explanation.visualWorking.length >= 3, `${ql.qlId} ${seed} ${locale} completion visual too thin`);
        if (ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") {
          assert(!question.structuredPrompt.sequence?.length, `${ql.qlId} ${seed} ${locale} option-only sequence leak`);
          assert(!question.structuredPrompt.word, `${ql.qlId} ${seed} ${locale} option-only word leak`);
        } else {
          assert((question.structuredPrompt.sequence?.length ?? 0) > 0, `${ql.qlId} ${seed} ${locale} completion sequence missing`);
        }
      }
    }
  }
}

const marketRange = generateAlp001Question("ALP-QL-103", 0, "en-IN");
assert(marketRange.stem.includes("reverse only") || marketRange.stem.includes("reverse"), "ALP-QL-103 restricted reversal wording");
assert(marketRange.explanation.visualWorking.length >= 3, "ALP-QL-103 alignment grid");
const chapterEnd = generateAlp001Question("ALP-QL-156", 0, "en-IN");
assert(chapterEnd.structuredPrompt.transformedSequence?.length, "ALP-QL-156 transformed sequence");
assert(chapterEnd.explanation.steps.length >= 2, "ALP-QL-156 composite explanation");

console.log("ALP-001 chapter-wide editorial V3 facade audit passed.", {
  qlCount: ALP_001_QLS.length,
  generated,
  localized,
  traps,
  answerShapeChecks,
  completionVisualChecks,
  solveModes: solveModes.size,
});
