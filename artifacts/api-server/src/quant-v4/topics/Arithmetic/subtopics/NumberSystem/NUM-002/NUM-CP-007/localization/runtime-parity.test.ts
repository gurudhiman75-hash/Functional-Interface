import { NUM_CP007_PERMANENT_ALLOCATION } from "../permanent/allocation.ts";
import { runNumCp007PermanentPipeline } from "../permanent/runtime.ts";
import { generateNumCp007LocalizedQuestion, translateNumCp007OptionValue } from "./runtime.ts";
import type { NumCp007TranslatedLocale } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp007TranslatedLocale[];
const seedsPerQl = 80;
let localizedQuestions = 0;
let deterministicReplayChecks = 0;
let mathematicalParityChecks = 0;
const reachedQls = new Map<NumCp007TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));
const reachedPrototypes = new Map<NumCp007TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));
const answerPositions = new Map<NumCp007TranslatedLocale, Set<number>>(LOCALES.map((locale) => [locale, new Set()]));
const difficulties = new Map<NumCp007TranslatedLocale, Set<string>>(LOCALES.map((locale) => [locale, new Set()]));

for (const locale of LOCALES) {
  for (const allocation of NUM_CP007_PERMANENT_ALLOCATION) {
    for (let seed = 1; seed <= seedsPerQl; seed += 1) {
      const english = runNumCp007PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
      const localized = generateNumCp007LocalizedQuestion({ questionLanguageId: allocation.qlId, seed, locale });
      const replay = generateNumCp007LocalizedQuestion({ questionLanguageId: allocation.qlId, seed, locale });
      localizedQuestions += 1;
      deterministicReplayChecks += 1;
      mathematicalParityChecks += 1;

      assert(JSON.stringify(localized) === JSON.stringify(replay), `${allocation.qlId}/${seed}/${locale}: replay mismatch`);
      assert(localized.questionLanguageId === english.questionLanguageId, `${allocation.qlId}/${seed}/${locale}: QL mismatch`);
      assert(localized.questionId === english.questionId, `${allocation.qlId}/${seed}/${locale}: question identity mismatch`);
      assert(localized.authorityId === english.authorityId, `${allocation.qlId}/${seed}/${locale}: authority mismatch`);
      assert(localized.solveModeId === english.solveModeId, `${allocation.qlId}/${seed}/${locale}: solve-mode mismatch`);
      assert(localized.temporaryPrototypeId === english.temporaryPrototypeId, `${allocation.qlId}/${seed}/${locale}: prototype mismatch`);
      assert(localized.seed === english.seed && localized.sourceSeed === english.sourceSeed, `${allocation.qlId}/${seed}/${locale}: seed mismatch`);
      assert(localized.difficulty === english.difficulty, `${allocation.qlId}/${seed}/${locale}: difficulty mismatch`);
      assert(localized.answerSemantic === english.answerSemantic, `${allocation.qlId}/${seed}/${locale}: semantic mismatch`);
      assert(localized.representation === english.representation, `${allocation.qlId}/${seed}/${locale}: representation mismatch`);
      assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${allocation.qlId}/${seed}/${locale}: fingerprint mismatch`);
      assert(JSON.stringify(localized.hiddenState) === JSON.stringify(english.hiddenState), `${allocation.qlId}/${seed}/${locale}: hidden-state mismatch`);
      assert(localized.correctIndex === english.correctIndex, `${allocation.qlId}/${seed}/${locale}: correct-index mismatch`);
      assert(localized.options.length === english.options.length, `${allocation.qlId}/${seed}/${locale}: option-count mismatch`);

      english.options.forEach((option, index) => {
        const translated = localized.options[index]!;
        assert(translated.value === translateNumCp007OptionValue(option.value, locale), `${allocation.qlId}/${seed}/${locale}: option translation mismatch`);
        assert(translated.isCorrect === option.isCorrect, `${allocation.qlId}/${seed}/${locale}: option correctness mismatch`);
        assert(translated.misconceptionId === option.misconceptionId, `${allocation.qlId}/${seed}/${locale}: misconception mismatch`);
      });

      assert(localized.canonicalAnswer === translateNumCp007OptionValue(english.canonicalAnswer, locale), `${allocation.qlId}/${seed}/${locale}: answer mismatch`);
      assert(localized.verifierAnswer === translateNumCp007OptionValue(english.verifierAnswer, locale), `${allocation.qlId}/${seed}/${locale}: verifier mismatch`);
      assert(localized.options[localized.correctIndex]?.value === localized.canonicalAnswer, `${allocation.qlId}/${seed}/${locale}: answer/index mismatch`);
      assert(localized.localization.canonicalAnswer === english.canonicalAnswer, `${allocation.qlId}/${seed}/${locale}: canonical trace mismatch`);
      assert(localized.localization.canonicalVerifierAnswer === english.verifierAnswer, `${allocation.qlId}/${seed}/${locale}: verifier trace mismatch`);
      assert(localized.localization.mathematicalStatePreserved, `${allocation.qlId}/${seed}/${locale}: state flag`);
      assert(localized.localization.optionOrderPreserved, `${allocation.qlId}/${seed}/${locale}: option-order flag`);
      assert(localized.localization.correctIndexPreserved, `${allocation.qlId}/${seed}/${locale}: index flag`);
      assert(localized.localization.misconceptionMappingPreserved, `${allocation.qlId}/${seed}/${locale}: misconception flag`);
      assert(localized.localization.lifecycleLocked, `${allocation.qlId}/${seed}/${locale}: lifecycle flag`);
      assert(!localized.lifecycle.active && !localized.lifecycle.questionStudioDiscoverable && !localized.lifecycle.questionBankWritable && !localized.lifecycle.testEligible && !localized.lifecycle.publiclyPublishable, `${allocation.qlId}/${seed}/${locale}: lifecycle leak`);

      reachedQls.get(locale)!.add(allocation.qlId);
      reachedPrototypes.get(locale)!.add(localized.temporaryPrototypeId);
      answerPositions.get(locale)!.add(localized.correctIndex);
      difficulties.get(locale)!.add(localized.difficulty);
    }
  }
}

assert(localizedQuestions === 4_160, "localized corpus size");
for (const locale of LOCALES) {
  assert(reachedQls.get(locale)!.size === 26, `${locale}: QL coverage`);
  assert(reachedPrototypes.get(locale)!.size === 32, `${locale}: prototype coverage`);
  assert(JSON.stringify([...answerPositions.get(locale)!].sort()) === JSON.stringify([0, 1, 2, 3]), `${locale}: answer positions`);
  assert(JSON.stringify([...difficulties.get(locale)!].sort()) === JSON.stringify(["EASY", "HARD", "MEDIUM"]), `${locale}: difficulty coverage`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_HI_PA_MATHEMATICAL_PARITY",
  translatedLocaleCount: LOCALES.length,
  permanentQlCount: NUM_CP007_PERMANENT_ALLOCATION.length,
  sourcePrototypeCount: 32,
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
