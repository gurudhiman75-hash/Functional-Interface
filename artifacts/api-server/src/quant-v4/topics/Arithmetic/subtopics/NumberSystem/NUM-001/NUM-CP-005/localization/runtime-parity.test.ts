import {
  NUM_CP005_PERMANENT_ALLOCATION,
  NUM_CP005_PERMANENT_QL_IDS,
} from "../permanent/allocation";
import { runNumCp005PermanentPipeline } from "../permanent/runtime";
import { translateNumCp005LocalizedOptionValue } from "./dynamic-option-translation";
import { generateNumCp005LocalizedQuestion } from "./runtime";
import type { NumCp005TranslatedLocale } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp005TranslatedLocale[];
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const seedsPerQl = 80;
let localizedQuestions = 0;
let deterministicReplayChecks = 0;
let mathematicalParityChecks = 0;
const reachedQls = new Map<NumCp005TranslatedLocale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);
const reachedPrototypes = new Map<NumCp005TranslatedLocale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);
const answerPositions = new Map<NumCp005TranslatedLocale, Set<number>>(
  LOCALES.map((locale) => [locale, new Set<number>()]),
);
const difficulties = new Map<NumCp005TranslatedLocale, Set<string>>(
  LOCALES.map((locale) => [locale, new Set<string>()]),
);

for (const locale of LOCALES) {
  const script = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
  for (const allocation of NUM_CP005_PERMANENT_ALLOCATION) {
    for (let seed = 1; seed <= seedsPerQl; seed += 1) {
      const english = runNumCp005PermanentPipeline({
        questionLanguageId: allocation.qlId,
        seed,
      });
      const localized = generateNumCp005LocalizedQuestion({
        questionLanguageId: allocation.qlId,
        seed,
        locale,
      });
      const replay = generateNumCp005LocalizedQuestion({
        questionLanguageId: allocation.qlId,
        seed,
        locale,
      });

      localizedQuestions += 1;
      deterministicReplayChecks += 1;
      mathematicalParityChecks += 1;

      assert(JSON.stringify(localized) === JSON.stringify(replay), `${allocation.qlId}/${seed}/${locale}: replay mismatch`);
      assert(localized.questionLanguageId === english.questionLanguageId, `${allocation.qlId}/${seed}/${locale}: QL mismatch`);
      assert(localized.permanentQlId === english.permanentQlId, `${allocation.qlId}/${seed}/${locale}: permanent ID mismatch`);
      assert(localized.authorityId === english.authorityId, `${allocation.qlId}/${seed}/${locale}: authority mismatch`);
      assert(localized.solveModeId === english.solveModeId, `${allocation.qlId}/${seed}/${locale}: solve-mode mismatch`);
      assert(localized.temporaryPrototypeId === english.temporaryPrototypeId, `${allocation.qlId}/${seed}/${locale}: prototype mismatch`);
      assert(localized.seed === english.seed, `${allocation.qlId}/${seed}/${locale}: seed mismatch`);
      assert(localized.sourceSeed === english.sourceSeed, `${allocation.qlId}/${seed}/${locale}: source seed mismatch`);
      assert(localized.difficulty === english.difficulty, `${allocation.qlId}/${seed}/${locale}: difficulty mismatch`);
      assert(localized.answerSemantic === english.answerSemantic, `${allocation.qlId}/${seed}/${locale}: semantic mismatch`);
      assert(localized.representation === english.representation, `${allocation.qlId}/${seed}/${locale}: representation mismatch`);
      assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${allocation.qlId}/${seed}/${locale}: fingerprint mismatch`);
      assert(JSON.stringify(localized.hiddenState) === JSON.stringify(english.hiddenState), `${allocation.qlId}/${seed}/${locale}: hidden-state mismatch`);
      assert(localized.correctIndex === english.correctIndex, `${allocation.qlId}/${seed}/${locale}: correct-index mismatch`);
      assert(localized.options.length === english.options.length, `${allocation.qlId}/${seed}/${locale}: option count mismatch`);

      english.options.forEach((option, index) => {
        const translated = localized.options[index]!;
        assert(
          translated.value === translateNumCp005LocalizedOptionValue(allocation.qlId, option.value, locale),
          `${allocation.qlId}/${seed}/${locale}: option value mismatch`,
        );
        assert(translated.isCorrect === option.isCorrect, `${allocation.qlId}/${seed}/${locale}: option correctness mismatch`);
        assert(translated.misconceptionId === option.misconceptionId, `${allocation.qlId}/${seed}/${locale}: misconception mismatch`);
      });

      const expectedAnswer = translateNumCp005LocalizedOptionValue(
        allocation.qlId,
        english.canonicalAnswer,
        locale,
      );
      assert(localized.canonicalAnswer === expectedAnswer, `${allocation.qlId}/${seed}/${locale}: answer translation mismatch`);
      assert(
        localized.verifierAnswer === translateNumCp005LocalizedOptionValue(
          allocation.qlId,
          english.verifierAnswer,
          locale,
        ),
        `${allocation.qlId}/${seed}/${locale}: verifier translation mismatch`,
      );
      assert(localized.options[localized.correctIndex]?.value === localized.canonicalAnswer, `${allocation.qlId}/${seed}/${locale}: localized answer/index mismatch`);
      assert(localized.localization.canonicalAnswer === english.canonicalAnswer, `${allocation.qlId}/${seed}/${locale}: canonical answer trace mismatch`);
      assert(localized.localization.canonicalVerifierAnswer === english.verifierAnswer, `${allocation.qlId}/${seed}/${locale}: canonical verifier trace mismatch`);
      assert(localized.localization.mathematicalStatePreserved, `${allocation.qlId}/${seed}/${locale}: state-preservation flag`);
      assert(localized.localization.optionOrderPreserved, `${allocation.qlId}/${seed}/${locale}: option-order flag`);
      assert(localized.localization.correctIndexPreserved, `${allocation.qlId}/${seed}/${locale}: index-preservation flag`);

      assert(script.test(localized.stem), `${allocation.qlId}/${seed}/${locale}: stem script missing`);
      assert(script.test(localized.explanation.coreConcept), `${allocation.qlId}/${seed}/${locale}: concept script missing`);
      assert(script.test(localized.explanation.givenDataAndStrategy), `${allocation.qlId}/${seed}/${locale}: strategy script missing`);
      assert(localized.explanation.stepByStep.every((line) => script.test(line)), `${allocation.qlId}/${seed}/${locale}: step script missing`);
      assert(script.test(localized.explanation.examSpeedMethod), `${allocation.qlId}/${seed}/${locale}: speed script missing`);
      assert(localized.explanation.commonTraps.every((line) => script.test(line)), `${allocation.qlId}/${seed}/${locale}: trap script missing`);
      assert(script.test(localized.explanation.finalAnswer), `${allocation.qlId}/${seed}/${locale}: final-answer script missing`);
      assert(localized.options.every((option) => script.test(option.analysis)), `${allocation.qlId}/${seed}/${locale}: option-analysis script missing`);

      assert(localized.reviewStatus === "LOCALIZED_REVIEW_REQUIRED", `${allocation.qlId}/${seed}/${locale}: review status`);
      assert(localized.maturity === "MULTILINGUAL_LOCALISATION_REVIEW", `${allocation.qlId}/${seed}/${locale}: maturity`);
      assert(!localized.lifecycle.active, `${allocation.qlId}/${seed}/${locale}: active leak`);
      assert(!localized.lifecycle.questionStudioDiscoverable, `${allocation.qlId}/${seed}/${locale}: Question Studio leak`);
      assert(!localized.lifecycle.questionBankWritable, `${allocation.qlId}/${seed}/${locale}: Question Bank leak`);
      assert(!localized.lifecycle.testEligible, `${allocation.qlId}/${seed}/${locale}: test leak`);
      assert(!localized.lifecycle.publiclyPublishable, `${allocation.qlId}/${seed}/${locale}: public leak`);

      reachedQls.get(locale)!.add(allocation.qlId);
      reachedPrototypes.get(locale)!.add(localized.temporaryPrototypeId);
      answerPositions.get(locale)!.add(localized.correctIndex);
      difficulties.get(locale)!.add(localized.difficulty);
    }
  }

  assert(reachedQls.get(locale)!.size === NUM_CP005_PERMANENT_QL_IDS.length, `${locale}: QL coverage`);
  assert(reachedPrototypes.get(locale)!.size === 32, `${locale}: prototype coverage`);
  assert(JSON.stringify([...answerPositions.get(locale)!].sort()) === JSON.stringify([0, 1, 2, 3]), `${locale}: answer positions`);
  assert(JSON.stringify([...difficulties.get(locale)!].sort()) === JSON.stringify(["EASY", "HARD", "MEDIUM"]), `${locale}: difficulties`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_HI_PA_MATHEMATICAL_PARITY",
  translatedLocaleCount: LOCALES.length,
  permanentQlCount: NUM_CP005_PERMANENT_QL_IDS.length,
  seedsPerQl,
  localizedQuestions,
  deterministicReplayChecks,
  mathematicalParityChecks,
  reachedQlsByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, reachedQls.get(locale)!.size])),
  reachedPrototypesByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, reachedPrototypes.get(locale)!.size])),
  answerPositionsByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, [...answerPositions.get(locale)!].sort()])),
  difficultiesByLocale: Object.fromEntries(LOCALES.map((locale) => [locale, [...difficulties.get(locale)!].sort()])),
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
