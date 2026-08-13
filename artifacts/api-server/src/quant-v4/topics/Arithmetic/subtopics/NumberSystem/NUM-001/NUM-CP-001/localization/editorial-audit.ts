import assert from "node:assert/strict";
import { NUM_CP001_PERMANENT_QL_IDS } from "../permanent/allocation";
import { runNumCp001PermanentPipeline } from "../permanent/runtime";
import { runNumCp001LocalizedPipeline } from "./runtime";
import type { NumCp001TranslatedLocale } from "./types";

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp001TranslatedLocale[];
const SEEDS_PER_QL = 36;
const FORBIDDEN_ENGLISH_PROSE = /\b(the|is|are|which|find|integer|integers|number|numbers|statement|statements|correct|final answer|possible|impossible|even|odd|least|greatest|distance|arrange|following|value|values|contains|exactly|both|sufficient|natural|whole|rational|irrational|ascending|interval)\b/i;
const INTERNAL_ID = /\b(?:NUM-(?:CP|QL)|PROT-|AUTH-|SOLVE-|QLT-|PRODUCT_OWNER|IMPLEMENTATION_FROZEN)\b/i;
const INVALID_VALUE = /\b(?:undefined|null|NaN|Infinity)\b/;

let questions = 0;
let optionViolations = 0;
let verifierViolations = 0;
let lifecycleViolations = 0;
let englishProseLeaks = 0;
let internalIdLeaks = 0;
let invalidValues = 0;
let crossQlStemCollisions = 0;
let conflictingSurfaceAnswers = 0;
let maxStemChars = 0;
let maxStemWords = 0;
let maxExplanationChars = 0;
const exactStems = new Map<NumCp001TranslatedLocale, Set<string>>();
const exactExplanations = new Map<NumCp001TranslatedLocale, Set<string>>();
const stemOwner = new Map<string, string>();
const fullSurfaceAnswer = new Map<string, string>();
const answerPositions = new Map<NumCp001TranslatedLocale, number[]>();

for (const locale of LOCALES) {
  exactStems.set(locale, new Set());
  exactExplanations.set(locale, new Set());
  answerPositions.set(locale, [0, 0, 0, 0]);

  for (const qlId of NUM_CP001_PERMANENT_QL_IDS) {
    for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
      const canonical = runNumCp001PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" });
      const q = runNumCp001LocalizedPipeline({ questionLanguageId: qlId, seed, locale });
      questions += 1;

      assert.notEqual(q.stem, canonical.stem, `${locale}/${qlId}/${seed}: stem was not localized`);
      assert.notDeepEqual(q.explanation, canonical.explanation, `${locale}/${qlId}/${seed}: explanation was not localized`);

      const learnerSurface = [
        q.stem,
        ...q.options.map((o) => o.value),
        ...q.explanation.coreConcept,
        ...q.explanation.givenDataAndStrategy,
        ...q.explanation.stepByStep,
        ...q.explanation.examSpeedMethod,
        ...q.explanation.commonTraps,
        q.explanation.finalAnswer,
      ].join("\n");

      const requiredScript = locale === "hi-IN" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
      assert.ok(requiredScript.test(q.stem), `${locale}/${qlId}/${seed}: localized script missing from stem`);
      assert.ok(requiredScript.test(JSON.stringify(q.explanation)), `${locale}/${qlId}/${seed}: localized script missing from explanation`);

      if (FORBIDDEN_ENGLISH_PROSE.test(learnerSurface)) englishProseLeaks += 1;
      if (INTERNAL_ID.test(learnerSurface)) internalIdLeaks += 1;
      if (INVALID_VALUE.test(learnerSurface)) invalidValues += 1;

      const optionValues = q.options.map((o) => o.value);
      if (q.options.length !== 4 || new Set(optionValues).size !== 4 || q.options.filter((o) => o.isCorrect).length !== 1 || !q.options[q.correctIndex]?.isCorrect) {
        optionViolations += 1;
      }
      if (q.canonicalAnswer !== q.verifierAnswer || q.options[q.correctIndex]?.value !== q.canonicalAnswer) verifierViolations += 1;
      if (q.lifecycle.active || q.lifecycle.questionStudioDiscoverable || q.lifecycle.questionBankWritable || q.lifecycle.testEligible || q.lifecycle.publiclyPublishable) lifecycleViolations += 1;

      const normalizedStem = q.stem.replace(/\s+/g, " ").trim();
      const stemKey = `${locale}:${normalizedStem}`;
      const existingOwner = stemOwner.get(stemKey);
      if (existingOwner && existingOwner !== qlId) crossQlStemCollisions += 1;
      else stemOwner.set(stemKey, qlId);

      const fullSurface = `${locale}:${normalizedStem}||${optionValues.join("||")}`;
      const existingAnswer = fullSurfaceAnswer.get(fullSurface);
      if (existingAnswer !== undefined && existingAnswer !== q.canonicalAnswer) conflictingSurfaceAnswers += 1;
      else fullSurfaceAnswer.set(fullSurface, q.canonicalAnswer);

      exactStems.get(locale)!.add(normalizedStem);
      exactExplanations.get(locale)!.add(JSON.stringify(q.explanation));
      answerPositions.get(locale)![q.correctIndex] += 1;
      maxStemChars = Math.max(maxStemChars, q.stem.length);
      maxStemWords = Math.max(maxStemWords, q.stem.trim().split(/\s+/).length);
      maxExplanationChars = Math.max(maxExplanationChars, JSON.stringify(q.explanation).length);
    }
  }
}

assert.equal(optionViolations, 0);
assert.equal(verifierViolations, 0);
assert.equal(lifecycleViolations, 0);
assert.equal(englishProseLeaks, 0);
assert.equal(internalIdLeaks, 0);
assert.equal(invalidValues, 0);
assert.equal(crossQlStemCollisions, 0);
assert.equal(conflictingSurfaceAnswers, 0);
assert.ok(maxStemChars <= 520, `localized stem too long: ${maxStemChars}`);
assert.ok(maxStemWords <= 100, `localized stem too wordy: ${maxStemWords}`);
assert.ok(maxExplanationChars <= 2600, `localized explanation too long: ${maxExplanationChars}`);
for (const locale of LOCALES) {
  assert.ok(exactStems.get(locale)!.size >= 180, `${locale}: insufficient stem diversity`);
  assert.ok(exactExplanations.get(locale)!.size >= 250, `${locale}: insufficient explanation diversity`);
  assert.ok(answerPositions.get(locale)!.every((count) => count > 0));
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_HI_PA_EDITORIAL_AUDIT",
  locales: LOCALES,
  permanentQlCount: NUM_CP001_PERMANENT_QL_IDS.length,
  seedsPerQlPerLocale: SEEDS_PER_QL,
  questions,
  exactStemCount: Object.fromEntries(LOCALES.map((locale) => [locale, exactStems.get(locale)!.size])),
  exactExplanationCount: Object.fromEntries(LOCALES.map((locale) => [locale, exactExplanations.get(locale)!.size])),
  answerPositions: Object.fromEntries(LOCALES.map((locale) => [locale, answerPositions.get(locale)])),
  maxStemChars,
  maxStemWords,
  maxExplanationChars,
  crossQlStemCollisions,
  conflictingSurfaceAnswers,
  optionViolations,
  verifierViolations,
  lifecycleViolations,
  englishProseLeaks,
  internalIdLeaks,
  invalidValues,
}, null, 2));
