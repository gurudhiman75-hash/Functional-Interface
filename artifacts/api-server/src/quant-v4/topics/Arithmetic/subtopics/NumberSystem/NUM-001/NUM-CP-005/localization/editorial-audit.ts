import { NUM_CP005_PERMANENT_ALLOCATION } from "../permanent/allocation";
import { generateNumCp005LocalizedQuestion } from "./runtime";
import type { NumCp005TranslatedLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp005TranslatedLocale[];
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const ENGLISH_PROSE = /\b(?:positive divisors?|prime factors?|proper divisors?|odd divisors?|even divisors?|perfect[- ]square|find|determine|which statements?|statement|solution|number A|number B|cannot be determined|final answer|core concept|strategy|common traps?|true|false)\b/i;
const INTERNAL_ID = /NUM-(?:QL|CP)|CP005-(?:PROT|AUTH|SM)|QLC-|runtimeVersion|sourceAncestry|prototypeAncestry/i;
const INVALID_VALUE = /(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/;
const seedsPerQl = 36;
let generatedAuditQuestions = 0;
let lifecycleViolations = 0;
let optionViolations = 0;
let EnglishLeakViolations = 0;
let internalIdLeaks = 0;
let invalidValueLeaks = 0;
let crossQlStemCollisions = 0;
let maximumProseStemCharacters = 0;
let maximumStructuredStemCharacters = 0;
const exactStemCountByLocale = new Map<NumCp005TranslatedLocale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);
const exactExplanationCountByLocale = new Map<NumCp005TranslatedLocale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);
const stemOwnerByLocale = new Map<NumCp005TranslatedLocale, Map<string, string>>(
  LOCALES.map((locale) => [locale, new Map<string, string>()]),
);

for (const locale of LOCALES) {
  const script = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
  for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
    for (let seed = 1; seed <= seedsPerQl; seed += 1) {
      const question = generateNumCp005LocalizedQuestion({
        questionLanguageId: allocation.qlId,
        seed,
        locale,
      });
      generatedAuditQuestions += 1;

      const normalizedStem = question.stem.toLowerCase().replace(/\s+/g, " ").trim();
      const priorOwner = stemOwnerByLocale.get(locale)!.get(normalizedStem);
      if (priorOwner && priorOwner !== allocation.qlId) crossQlStemCollisions += 1;
      stemOwnerByLocale.get(locale)!.set(normalizedStem, allocation.qlId);
      exactStemCountByLocale.get(locale)!.add(question.stem);
      exactExplanationCountByLocale.get(locale)!.add(JSON.stringify(question.explanation));

      const structured = question.representation === "DIVISOR_PAIR_TABLE";
      const limit = structured ? 700 : 420;
      if (structured) {
        maximumStructuredStemCharacters = Math.max(maximumStructuredStemCharacters, question.stem.length);
      } else {
        maximumProseStemCharacters = Math.max(maximumProseStemCharacters, question.stem.length);
      }
      assert(question.stem.length <= limit, `${allocation.qlId}/${seed}/${locale}: stem length ${question.stem.length}`);
      assert(script.test(question.stem), `${allocation.qlId}/${seed}/${locale}: stem script missing`);
      assert(script.test(question.explanation.coreConcept), `${allocation.qlId}/${seed}/${locale}: concept script missing`);
      assert(script.test(question.explanation.givenDataAndStrategy), `${allocation.qlId}/${seed}/${locale}: strategy script missing`);
      assert(question.explanation.stepByStep.every((line) => script.test(line)), `${allocation.qlId}/${seed}/${locale}: step script missing`);
      assert(script.test(question.explanation.examSpeedMethod), `${allocation.qlId}/${seed}/${locale}: speed script missing`);
      assert(question.explanation.commonTraps.length === 3, `${allocation.qlId}/${seed}/${locale}: trap count`);
      assert(question.explanation.commonTraps.every((line) => script.test(line)), `${allocation.qlId}/${seed}/${locale}: trap script missing`);
      assert(script.test(question.explanation.finalAnswer), `${allocation.qlId}/${seed}/${locale}: final answer script missing`);

      const wrongOptions = question.options.filter((option) => !option.isCorrect);
      if (
        question.options.length !== 4
        || new Set(question.options.map((option) => option.value)).size !== 4
        || question.options.filter((option) => option.isCorrect).length !== 1
        || wrongOptions.length !== 3
        || wrongOptions.some((option) => !option.misconceptionId || !option.analysis.trim())
        || question.options.some((option) => !script.test(option.analysis))
        || question.options[question.correctIndex]?.value !== question.canonicalAnswer
      ) optionViolations += 1;

      const learnerText = [
        question.stem,
        ...question.options.map((option) => option.value),
        ...question.options.map((option) => option.analysis),
        question.explanation.coreConcept,
        question.explanation.givenDataAndStrategy,
        ...question.explanation.stepByStep,
        question.explanation.examSpeedMethod,
        ...question.explanation.commonTraps,
        question.explanation.finalAnswer,
      ].join("\n");
      if (ENGLISH_PROSE.test(learnerText)) EnglishLeakViolations += 1;
      if (INTERNAL_ID.test(learnerText)) internalIdLeaks += 1;
      if (INVALID_VALUE.test(learnerText)) invalidValueLeaks += 1;

      if (
        question.lifecycle.active
        || question.lifecycle.questionStudioDiscoverable
        || question.lifecycle.questionBankWritable
        || question.lifecycle.testEligible
        || question.lifecycle.publiclyPublishable
        || question.reviewStatus !== "LOCALIZED_REVIEW_REQUIRED"
        || question.localization.status !== "EXECUTABLE_REVIEW_REQUIRED"
      ) lifecycleViolations += 1;
    }
  }
}

assert(generatedAuditQuestions === 1_728, "audit corpus size");
assert(crossQlStemCollisions === 0, "cross-QL localized stem collision");
assert(lifecycleViolations === 0, "lifecycle violations");
assert(optionViolations === 0, "option violations");
assert(EnglishLeakViolations === 0, "English prose leaks");
assert(internalIdLeaks === 0, "internal identity leaks");
assert(invalidValueLeaks === 0, "invalid value leaks");

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_HI_PA_EDITORIAL_AUDIT",
  translatedLocaleCount: LOCALES.length,
  permanentQlCount: NUM_CP005_PERMANENT_ALLOCATION.length,
  seedsPerQl,
  generatedAuditQuestions,
  exactStemCountByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, exactStemCountByLocale.get(locale)!.size])),
  exactExplanationCountByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, exactExplanationCountByLocale.get(locale)!.size])),
  maximumProseStemCharacters,
  maximumStructuredStemCharacters,
  proseStemCharacterLimit: 420,
  structuredStemCharacterLimit: 700,
  crossQlStemCollisions,
  lifecycleViolations,
  optionViolations,
  EnglishLeakViolations,
  internalIdLeaks,
  invalidValueLeaks,
  localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
}, null, 2));
