import { NUM_CP006_PERMANENT_ALLOCATION } from "../permanent/allocation";
import { runNumCp006PermanentPipeline } from "../permanent/runtime";
import { generateNumCp006LocalizedQuestion, translateNumCp006OptionValue } from "./runtime";
import type { NumCp006TranslatedLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp006TranslatedLocale[];
const seedsPerQl = 80;
let localizedQuestions = 0;
let deterministicReplayChecks = 0;
let mathematicalParityChecks = 0;
const reachedQls = new Map<NumCp006TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));
const reachedPrototypes = new Map<NumCp006TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));
const answerPositions = new Map<NumCp006TranslatedLocale, Set<number>>(LOCALES.map((locale) => [locale, new Set()]));
const difficulties = new Map<NumCp006TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));

for (const locale of LOCALES) {
  for (const allocation of NUM_CP006_PERMANENT_ALLOCATION) {
    for (let seed = 1; seed <= seedsPerQl; seed += 1) {
      const english = runNumCp006PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
      const localized = generateNumCp006LocalizedQuestion({ questionLanguageId: allocation.qlId, seed, locale });
      const replay = generateNumCp006LocalizedQuestion({ questionLanguageId: allocation.qlId, seed, locale });
      localizedQuestions += 1;
      deterministicReplayChecks += 1;
      mathematicalParityChecks += 1;

      assert(JSON.stringify(localized) === JSON.stringify(replay), `${allocation.qlId}/${seed}/${locale}: replay mismatch`);
      assert(localized.questionLanguageId === english.questionLanguageId, `${allocation.qlId}/${seed}/${locale}: QL mismatch`);
      assert(localized.questionId === english.questionId, `${allocation.qlId}/${seed}/${locale}: question identity mismatch`);
      assert(localized.authorityId === english.authorityId, `${allocation.qlId}/${seed}/${locale}: authority mismatch`);
      assert(localized.solveModeId === english.solveModeId, `${allocation.qlId}/${seed}/${locale}: solve mode mismatch`);
      assert(localized.temporaryPrototypeId === english.temporaryPrototypeId, `${allocation.qlId}/${seed}/${locale}: prototype mismatch`);
      assert(localized.seed === english.seed && localized.sourceSeed === english.sourceSeed, `${allocation.qlId}/${seed}/${locale}: seed mismatch`);
      assert(localized.difficulty === english.difficulty, `${allocation.qlId}/${seed}/${locale}: difficulty mismatch`);
      assert(localized.answerSemantic === english.answerSemantic, `${allocation.qlId}/${seed}/${locale}: semantic mismatch`);
      assert(localized.representation === english.representation, `${allocation.qlId}/${seed}/${locale}: representation mismatch`);
      assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${allocation.qlId}/${seed}/${locale}: fingerprint mismatch`);
      assert(JSON.stringify(localized.hiddenState) === JSON.stringify(english.hiddenState), `${allocation.qlId}/${seed}/${locale}: hidden-state mismatch`);
      assert(localized.correctIndex === english.correctIndex, `${allocation.qlId}/${seed}/${locale}: correct-index mismatch`);
      assert(localized.options.length === english.options.length, `${allocation.qlId}/${seed}/${locale}: option count mismatch`);
      english.options.forEach((option, index) => {
        const translated = localized.options[index]!;
        assert(translated.value === translateNumCp006OptionValue(option.value, locale), `${allocation.qlId}/${seed}/${locale}: option translation mismatch`);
        assert(translated.isCorrect === option.isCorrect, `${allocation.qlId}/${seed}/${locale}: option correctness mismatch`);
        assert(translated.misconceptionId === option.misconceptionId, `${allocation.qlId}/${seed}/${locale}: misconception mismatch`);
      });
      assert(localized.canonicalAnswer === translateNumCp006OptionValue(english.canonicalAnswer, locale), `${allocation.qlId}/${seed}/${locale}: answer mismatch`);
      assert(localized.verifierAnswer === translateNumCp006OptionValue(english.verifierAnswer, locale), `${allocation.qlId}/${seed}/${locale}: verifier mismatch`);
      assert(localized.options[localized.correctIndex]?.value === localized.canonicalAnswer, `${allocation.qlId}/${seed}/${locale}: answer/index mismatch`);
      assert(localized.localization.canonicalAnswer === english.canonicalAnswer, `${allocation.qlId}/${seed}/${locale}: canonical trace mismatch`);
      assert(localized.localization.canonicalVerifierAnswer === english.verifierAnswer, `${allocation.qlId}/${seed}/${locale}: verifier trace mismatch`);
      assert(localized.localization.mathematicalStatePreserved, `${allocation.qlId}/${seed}/${locale}: state flag`);
      assert(localized.localization.optionOrderPreserved, `${allocation.qlId}/${seed}/${locale}: option order flag`);
      assert(localized.localization.correctIndexPreserved, `${allocation.qlId}/${seed}/${locale}: index flag`);
      assert(localized.localization.lifecycleLocked, `${allocation.qlId}/${seed}/${locale}: lifecycle flag`);
      assert(!localized.lifecycle.active && !localized.lifecycle.questionStudioDiscoverable && !localized.lifecycle.questionBankWritable && !localized.lifecycle.testEligible && !localized.lifecycle.publiclyPublishable, `${allocation.qlId}/${seed}/${locale}: lifecycle leak`);

      reachedQls.get(locale)!.add(allocation.qlId);
      reachedPrototypes.get(locale)!.add(localized.temporaryPrototypeId);
      answerPositions.get(locale)!.add(localized.correctIndex);
      difficulties.get(locale)!.add(localized.difficulty);
    }
  }
}

assert(localizedQuestions === 4_480, "localized corpus size");
for (const locale of LOCALES) {
  assert(reachedQls.get(locale)!.size === 28, `${locale}: QL coverage`);
  assert(reachedPrototypes.get(locale)!.size === 29, `${locale}: prototype coverage`);
  assert(JSON.stringify([...answerPositions.get(locale)!].sort()) === JSON.stringify([0, 1, 2, 3]), `${locale}: answer positions`);
  assert(JSON.stringify([...difficulties.get(locale)!].sort()) === JSON.stringify(["EASY", "HARD", "MEDIUM"]), `${locale}: difficulty coverage`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_HI_PA_MATHEMATICAL_PARITY",
  translatedLocaleCount: LOCALES.length,
  permanentQlCount: NUM_CP006_PERMANENT_ALLOCATION.length,
  sourcePrototypeCount: 29,
  seedsPerQl,
  localizedQuestions,
  deterministicReplayChecks,
  mathematicalParityChecks,
  reachedQlsByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, reachedQls.get(locale)!.size])),
  reachedPrototypesByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, reachedPrototypes.get(locale)!.size])),
  answerPositionsByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, [...answerPositions.get(locale)!].sort()])),
  difficultiesByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, [...difficulties.get(locale)!].sort()])),
  lifecycleViolations: 0,
}, null, 2));
