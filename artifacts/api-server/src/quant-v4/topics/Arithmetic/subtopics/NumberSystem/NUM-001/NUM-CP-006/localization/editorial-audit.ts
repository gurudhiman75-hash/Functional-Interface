import { NUM_CP006_PERMANENT_ALLOCATION } from "../permanent/allocation";
import { generateNumCp006LocalizedQuestion } from "./runtime";
import type { NumCp006TranslatedLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp006TranslatedLocale[];
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const ENGLISH_PROSE = /\b(?:find|determine|which|greatest common divisor|least common multiple|final answer|core concept|strategy|common traps?|true only|cannot be determined|alone is sufficient|together are sufficient|insufficient)\b/i;
const INTERNAL_ID = /NUM-(?:QL|CP)|CP006-(?:PROT|AUTH|SM|QLC)|runtimeVersion|sourceAncestry|prototypeAncestry/i;
const INVALID_VALUE = /(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/;
const seedsPerQl = 36;
let generatedAuditQuestions = 0;
let lifecycleViolations = 0;
let optionViolations = 0;
let englishLeakViolations = 0;
let internalIdLeaks = 0;
let invalidValueLeaks = 0;
let crossQlStemCollisions = 0;
let maximumStemCharacters = 0;
let maximumOptionCharacters = 0;
let maximumExplanationCharacters = 0;
const exactStemCountByLocale = new Map<NumCp006TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));
const exactExplanationCountByLocale = new Map<NumCp006TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));
const stemOwnerByLocale = new Map<NumCp006TranslatedLocale, Map<string, string>>(LOCALES.map((locale) => [locale, new Map()]));
const answerPositionsByLocale = new Map<NumCp006TranslatedLocale, number[]>(LOCALES.map((locale) => [locale, [0, 0, 0, 0]]));

for (const locale of LOCALES) {
  const script = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
  for (const allocation of NUM_CP006_PERMANENT_ALLOCATION) {
    for (let seed = 1; seed <= seedsPerQl; seed += 1) {
      const question = generateNumCp006LocalizedQuestion({ questionLanguageId: allocation.qlId, seed, locale });
      generatedAuditQuestions += 1;
      const normalizedStem = question.stem.toLowerCase().replace(/\s+/g, " ").trim();
      const priorOwner = stemOwnerByLocale.get(locale)!.get(normalizedStem);
      if (priorOwner && priorOwner !== allocation.qlId) crossQlStemCollisions += 1;
      stemOwnerByLocale.get(locale)!.set(normalizedStem, allocation.qlId);
      exactStemCountByLocale.get(locale)!.add(question.stem);
      exactExplanationCountByLocale.get(locale)!.add(JSON.stringify(question.explanation));
      maximumStemCharacters = Math.max(maximumStemCharacters, question.stem.length);
      maximumOptionCharacters = Math.max(maximumOptionCharacters, ...question.options.map((option) => option.value.length));
      maximumExplanationCharacters = Math.max(maximumExplanationCharacters, JSON.stringify(question.explanation).length);
      answerPositionsByLocale.get(locale)![question.correctIndex] += 1;

      assert(question.stem.length <= 430, `${allocation.qlId}/${seed}/${locale}: stem length ${question.stem.length}`);
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
      if (ENGLISH_PROSE.test(learnerText)) englishLeakViolations += 1;
      if (INTERNAL_ID.test(learnerText)) internalIdLeaks += 1;
      if (INVALID_VALUE.test(learnerText)) invalidValueLeaks += 1;
      if (question.lifecycle.active || question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankWritable || question.lifecycle.testEligible || question.lifecycle.publiclyPublishable) lifecycleViolations += 1;
    }
  }
}

assert(generatedAuditQuestions === 2_016, "audit corpus size");
assert(crossQlStemCollisions === 0, "cross-QL localized stem collision");
assert(lifecycleViolations === 0, "lifecycle violations");
assert(optionViolations === 0, "option violations");
assert(englishLeakViolations === 0, "English prose leaks");
assert(internalIdLeaks === 0, "internal identity leaks");
assert(invalidValueLeaks === 0, "invalid value leaks");

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_HI_PA_EDITORIAL_AUDIT",
  translatedLocaleCount: LOCALES.length,
  permanentQlCount: NUM_CP006_PERMANENT_ALLOCATION.length,
  seedsPerQl,
  generatedAuditQuestions,
  exactStemCountByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, exactStemCountByLocale.get(locale)!.size])),
  exactExplanationCountByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, exactExplanationCountByLocale.get(locale)!.size])),
  answerPositionsByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, answerPositionsByLocale.get(locale)])),
  maximumStemCharacters,
  maximumOptionCharacters,
  maximumExplanationCharacters,
  crossQlStemCollisions,
  lifecycleViolations,
  optionViolations,
  englishLeakViolations,
  internalIdLeaks,
  invalidValueLeaks,
}, null, 2));
