import { NUM_CP007_PERMANENT_ALLOCATION } from "../permanent/allocation.ts";
import { generateNumCp007LocalizedQuestion } from "./runtime.ts";
import type { NumCp007TranslatedLocale } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp007TranslatedLocale[];
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const ENGLISH_PROSE = /\b(?:find|which|remainder|quotient|divisor|dividend|statement|sufficient|valid|invalid|integer|number|lower|upper|nearest|multiple|first|second|final answer|core concept|strategy)\b/i;
const INTERNAL_ID = /NUM-(?:QL|CP)|CP007-(?:PROT|AUTH|SM|QLC)|temporaryPrototype|runtimeVersion|sourceAncestry|prototypeAncestry/i;
const INVALID_VALUE = /(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/;
const seedsPerQl = 36;
let generatedAuditQuestions = 0;
let lifecycleViolations = 0;
let optionViolations = 0;
let verifierViolations = 0;
let englishLeakViolations = 0;
let internalIdLeaks = 0;
let invalidValueLeaks = 0;
let crossQlStemCollisions = 0;
let zeroRemainderExtremumLeaks = 0;
let cp006GreatestSameRemainderLeaks = 0;
let maximumStemCharacters = 0;
let maximumStemWords = 0;
let maximumExplanationCharacters = 0;
const exactStemCountByLocale = new Map<NumCp007TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));
const exactExplanationCountByLocale = new Map<NumCp007TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));
const stemOwnerByLocale = new Map<NumCp007TranslatedLocale, Map<string, string>>(LOCALES.map((locale) => [locale, new Map()]));
const answerPositionsByLocale = new Map<NumCp007TranslatedLocale, number[]>(LOCALES.map((locale) => [locale, [0, 0, 0, 0]]));

for (const locale of LOCALES) {
  const script = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
  for (const allocation of NUM_CP007_PERMANENT_ALLOCATION) {
    for (let seed = 1; seed <= seedsPerQl; seed += 1) {
      const question = generateNumCp007LocalizedQuestion({ questionLanguageId: allocation.qlId, seed, locale });
      generatedAuditQuestions += 1;
      const normalizedStem = question.stem.toLowerCase().replace(/\s+/g, " ").trim();
      const priorOwner = stemOwnerByLocale.get(locale)!.get(normalizedStem);
      if (priorOwner && priorOwner !== allocation.qlId) crossQlStemCollisions += 1;
      stemOwnerByLocale.get(locale)!.set(normalizedStem, allocation.qlId);
      exactStemCountByLocale.get(locale)!.add(question.stem);
      exactExplanationCountByLocale.get(locale)!.add(JSON.stringify(question.explanation));
      maximumStemCharacters = Math.max(maximumStemCharacters, question.stem.length);
      maximumStemWords = Math.max(maximumStemWords, question.stem.trim().split(/\s+/).length);
      maximumExplanationCharacters = Math.max(maximumExplanationCharacters, JSON.stringify(question.explanation).length);
      answerPositionsByLocale.get(locale)![question.correctIndex] += 1;

      assert(question.stem.length <= 650, `${allocation.qlId}/${seed}/${locale}: stem length ${question.stem.length}`);
      assert(question.stem.trim().split(/\s+/).length <= 120, `${allocation.qlId}/${seed}/${locale}: stem words`);
      assert(script.test(question.stem), `${allocation.qlId}/${seed}/${locale}: stem script missing`);
      assert(script.test(question.explanation.coreConcept), `${allocation.qlId}/${seed}/${locale}: concept script missing`);
      assert(script.test(question.explanation.strategy), `${allocation.qlId}/${seed}/${locale}: strategy script missing`);
      assert(question.explanation.steps.length >= 2, `${allocation.qlId}/${seed}/${locale}: too few steps`);
      assert(question.explanation.steps.every((line) => script.test(line)), `${allocation.qlId}/${seed}/${locale}: step script missing`);
      assert(script.test(question.explanation.finalAnswer), `${allocation.qlId}/${seed}/${locale}: final answer script missing`);

      if (
        question.options.length !== 4
        || new Set(question.options.map((option) => option.value)).size !== 4
        || question.options.filter((option) => option.isCorrect).length !== 1
        || question.options[question.correctIndex]?.value !== question.canonicalAnswer
        || question.options.some((option) => !option.misconceptionId)
      ) optionViolations += 1;
      if (question.canonicalAnswer !== question.verifierAnswer) verifierViolations += 1;

      const learnerText = [
        question.stem,
        ...question.options.map((option) => option.value),
        question.explanation.coreConcept,
        question.explanation.strategy,
        ...question.explanation.steps,
        question.explanation.finalAnswer,
      ].join("\n");
      if (ENGLISH_PROSE.test(learnerText)) englishLeakViolations += 1;
      if (INTERNAL_ID.test(learnerText)) internalIdLeaks += 1;
      if (INVALID_VALUE.test(learnerText)) invalidValueLeaks += 1;
      if (question.lifecycle.active || question.lifecycle.questionStudioDiscoverable || question.lifecycle.questionBankWritable || question.lifecycle.testEligible || question.lifecycle.publiclyPublishable) lifecycleViolations += 1;

      if (allocation.qlId === "NUM-QL-123") {
        if (Number(question.hiddenState.remainder) === 0) zeroRemainderExtremumLeaks += 1;
        if (locale === "hi-IN" && /पूर्णतः विभाज्य/.test(question.stem)) zeroRemainderExtremumLeaks += 1;
        if (locale === "pa-IN" && /ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ/.test(question.stem)) zeroRemainderExtremumLeaks += 1;
      }
      if (allocation.qlId === "NUM-QL-115") {
        if (locale === "hi-IN" && /सबसे (?:बड़ा|बड़ी).*भाजक/.test(question.stem)) cp006GreatestSameRemainderLeaks += 1;
        if (locale === "pa-IN" && /ਸਭ ਤੋਂ ਵੱਡਾ.*ਭਾਜਕ/.test(question.stem)) cp006GreatestSameRemainderLeaks += 1;
      }
    }
  }
}

assert(generatedAuditQuestions === 1_872, "audit corpus size");
assert(crossQlStemCollisions === 0, "cross-QL localized stem collision");
assert(lifecycleViolations === 0, "lifecycle violations");
assert(optionViolations === 0, "option violations");
assert(verifierViolations === 0, "verifier violations");
assert(englishLeakViolations === 0, "English prose leaks");
assert(internalIdLeaks === 0, "internal identity leaks");
assert(invalidValueLeaks === 0, "invalid value leaks");
assert(zeroRemainderExtremumLeaks === 0, "CP-003 zero-remainder extremum ownership leak");
assert(cp006GreatestSameRemainderLeaks === 0, "CP-006 greatest-same-remainder ownership leak");

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_HI_PA_EDITORIAL_AUDIT",
  translatedLocaleCount: LOCALES.length,
  permanentQlCount: NUM_CP007_PERMANENT_ALLOCATION.length,
  seedsPerQl,
  generatedAuditQuestions,
  exactStemCountByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, exactStemCountByLocale.get(locale)!.size])),
  exactExplanationCountByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, exactExplanationCountByLocale.get(locale)!.size])),
  answerPositionsByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, answerPositionsByLocale.get(locale)])),
  maximumStemCharacters,
  maximumStemWords,
  maximumExplanationCharacters,
  crossQlStemCollisions,
  lifecycleViolations,
  optionViolations,
  verifierViolations,
  englishLeakViolations,
  internalIdLeaks,
  invalidValueLeaks,
  zeroRemainderExtremumLeaks,
  cp006GreatestSameRemainderLeaks,
}, null, 2));
