import { NUM_CP005_PERMANENT_ALLOCATION } from "../permanent/allocation";
import { generateNumCp005LocalizedQuestion } from "./runtime";
import type { NumCp005TranslatedLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp005TranslatedLocale[];
const seedsPerQl = 60;
const forbiddenPatterns = [
  /है है/,
  /ਹੈ ਹੈ/,
  /ਸੰਖਿਆ ਨੂੰ ਆਪ ਨੂੰ/,
  /ਕਰਣੀਆਂ/,
  /ਲਕਸ਼/,
  /ਸਾਂਝਾ ਮਿਲਾਪ/,
  /ਨਿਯਮ-ਮੁੱਲ/,
  /ਇੱਕ ਛੋਟੇ ਵੇਰਵੇ ਵਿੱਚ/,
  /एक लघु विवरण में/,
  /ਢੰਗ ਦੇ ਭਾਜਕ/,
  /उचित धनात्मक भाजक/,
  /ਨਾਲ ਭਾਜਯ/,
  /ਪੂਰਨ rਵੀਂ/,
] as const;

let generatedQuestions = 0;
let forbiddenPhraseViolations = 0;
let genericOptionAnalysisViolations = 0;
let optionSpecificityViolations = 0;
let trapOwnershipViolations = 0;
let unrestrictedParityLeakViolations = 0;
let duplicateTrapViolations = 0;
let lifecycleViolations = 0;
const misconceptionIds = new Set<string>();
const violationSamples: string[] = [];
const uniqueAnalysesByLocale = new Map<NumCp005TranslatedLocale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);

for (const locale of LOCALES) {
  for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
    for (let seed = 1; seed <= seedsPerQl; seed += 1) {
      const question = generateNumCp005LocalizedQuestion({
        questionLanguageId: allocation.qlId,
        seed,
        locale,
      });
      generatedQuestions += 1;

      const learnerText = [
        question.stem,
        ...question.options.map((option) => option.analysis),
        question.explanation.coreConcept,
        question.explanation.givenDataAndStrategy,
        ...question.explanation.stepByStep,
        question.explanation.examSpeedMethod,
        ...question.explanation.commonTraps,
        question.explanation.finalAnswer,
      ].join("\n");

      const matchedPatterns = forbiddenPatterns.filter((pattern) => pattern.test(learnerText));
      if (matchedPatterns.length > 0) {
        forbiddenPhraseViolations += 1;
        if (violationSamples.length < 20) {
          violationSamples.push([
            `${locale}/${allocation.qlId}/${seed}`,
            ...matchedPatterns.map((pattern) => String(pattern)),
            learnerText,
          ].join("\n"));
        }
      }

      const wrongOptions = question.options.filter((option) => !option.isCorrect);
      for (const option of question.options) {
        uniqueAnalysesByLocale.get(locale)!.add(option.analysis);
        if (!option.analysis.includes(`“${option.value}”`)) {
          optionSpecificityViolations += 1;
        }
        if (
          option.analysis.includes("सामान्य गलती")
          || option.analysis.includes("ਆਮ ਗਲਤੀ")
          || option.analysis.includes("common error")
        ) {
          genericOptionAnalysisViolations += 1;
        }
        if (option.misconceptionId) misconceptionIds.add(option.misconceptionId);
      }

      const expectedTraps = wrongOptions.map((option) => option.analysis);
      if (JSON.stringify(question.explanation.commonTraps) !== JSON.stringify(expectedTraps)) {
        trapOwnershipViolations += 1;
      }
      if (new Set(question.explanation.commonTraps).size !== 3) {
        duplicateTrapViolations += 1;
      }

      if (
        question.questionLanguageId === "NUM-QL-057"
        && question.hiddenState.parity === "ANY"
      ) {
        const parityWords = locale === "hi-IN"
          ? /सम-विषम|विषम होने|सम होने/
          : /ਟਾਂਕ-ਜਿਸਤ|ਟਾਂਕ ਹੋਣ|ਜਿਸਤ ਹੋਣ/;
        const unrestrictedText = [
          question.explanation.coreConcept,
          question.explanation.givenDataAndStrategy,
          ...question.explanation.stepByStep,
          question.explanation.examSpeedMethod,
        ].join("\n");
        if (parityWords.test(unrestrictedText)) unrestrictedParityLeakViolations += 1;
      }

      if (
        question.lifecycle.active
        || question.lifecycle.questionStudioDiscoverable
        || question.lifecycle.questionBankWritable
        || question.lifecycle.testEligible
        || question.lifecycle.publiclyPublishable
      ) lifecycleViolations += 1;
    }
  }
}

console.log(JSON.stringify({
  status: forbiddenPhraseViolations === 0
    ? "NUM_CP005_HI_PA_LINGUISTIC_HARDENING_AUDIT_PENDING_ASSERTIONS"
    : "NUM_CP005_HI_PA_LINGUISTIC_HARDENING_RESIDUAL_PHRASES",
  translatedLocaleCount: LOCALES.length,
  permanentQlCount: NUM_CP005_PERMANENT_ALLOCATION.length,
  seedsPerQl,
  generatedQuestions,
  misconceptionIdCount: misconceptionIds.size,
  uniqueOptionAnalysesByLocale: Object.fromEntries(
    LOCALES.map((locale) => [locale, uniqueAnalysesByLocale.get(locale)!.size]),
  ),
  forbiddenPhraseViolations,
  genericOptionAnalysisViolations,
  optionSpecificityViolations,
  trapOwnershipViolations,
  unrestrictedParityLeakViolations,
  duplicateTrapViolations,
  lifecycleViolations,
  violationSamples,
  freezeStatus: "LINGUISTIC_HARDENING_REVIEW",
}, null, 2));

assert(generatedQuestions === 2_880, "linguistic audit corpus size");
assert(forbiddenPhraseViolations === 0, "forbidden phrase violations");
assert(genericOptionAnalysisViolations === 0, "generic option analysis violations");
assert(optionSpecificityViolations === 0, "option-specificity violations");
assert(trapOwnershipViolations === 0, "common-trap ownership violations");
assert(unrestrictedParityLeakViolations === 0, "unrestricted parity explanation leaks");
assert(duplicateTrapViolations === 0, "duplicate localized traps");
assert(lifecycleViolations === 0, "lifecycle violations");
assert(misconceptionIds.size >= 45, "misconception coverage");

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_HI_PA_LINGUISTIC_HARDENING_AUDIT",
  generatedQuestions,
  misconceptionIdCount: misconceptionIds.size,
  forbiddenPhraseViolations,
  genericOptionAnalysisViolations,
  optionSpecificityViolations,
  trapOwnershipViolations,
  unrestrictedParityLeakViolations,
  duplicateTrapViolations,
  lifecycleViolations,
}, null, 2));
