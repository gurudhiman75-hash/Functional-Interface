import assert from "node:assert/strict";
import { SER_CP007_TEMPLATE_PROBES_V71 } from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import { generateSerCp007PermanentEnglishPackage } from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-permanent-runtime";
import {
  generateSerCp007PermanentLocalizedPackage,
  regenerateSerCp007PermanentLocalizedPackage,
  SER_CP007_LOCALES,
  type SerCp007Locale,
} from "./ser-cp-007-localized-runtime-final";

// U+0964 and U+0965 are shared Indic danda punctuation, so they are not
// evidence of Hindi learner prose inside a Punjabi package.
const DEVANAGARI = /[\u0900-\u0963\u0966-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const ALLOWED_ASCII = new Set([
  "details",
  "summary",
  "strong",
  "st",
  "nd",
  "rd",
  "th",
]);

function scriptFor(locale: SerCp007Locale): RegExp {
  return locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
}

function otherScriptFor(locale: SerCp007Locale): RegExp {
  return locale === "hi-IN" ? GURMUKHI : DEVANAGARI;
}

function lastLine(value: string): string {
  return value.split("\n").at(-1)?.trim() ?? "";
}

function leakedWords(value: string): readonly string[] {
  return (value.match(/[A-Za-z]+/g) ?? []).filter((word) => {
    if (word.length === 1) return false;
    if (ALLOWED_ASCII.has(word.toLowerCase())) return false;
    if (word === word.toUpperCase()) return false;
    const upper = [...word].filter((letter) => /[A-Z]/.test(letter)).length;
    const lower = [...word].filter((letter) => /[a-z]/.test(letter)).length;
    return !(upper >= 2 && lower >= 1);
  });
}

function learnerText(input: {
  readonly review: {
    readonly conciseReview: string;
    readonly expandedReview: string;
    readonly workedSteps: readonly string[];
  };
  readonly question: {
    readonly explanation: {
      readonly rule: string;
      readonly steps: readonly string[];
      readonly quickMethod: string;
      readonly commonMistake: string;
      readonly conclusion: string;
    };
  };
}): string {
  return [
    input.review.conciseReview,
    input.review.expandedReview,
    ...input.review.workedSteps,
    input.question.explanation.rule,
    ...input.question.explanation.steps,
    input.question.explanation.quickMethod,
    input.question.explanation.commonMistake,
    input.question.explanation.conclusion,
  ].join("\n");
}

let localizedPackages = 0;
let deterministicProofs = 0;
let answerOptionParityProofs = 0;
let explanationParityProofs = 0;
let rendererParityProofs = 0;
let lifecycleLockProofs = 0;
let scriptProofs = 0;
let mixedScriptProofs = 0;
const reachedQls = new Set<string>();
const fallbackPatterns = new Map<SerCp007Locale, Set<string>>(
  SER_CP007_LOCALES.map((locale) => [locale, new Set<string>()]),
);
const englishLeaks = new Map<SerCp007Locale, Set<string>>(
  SER_CP007_LOCALES.map((locale) => [locale, new Set<string>()]),
);

for (const locale of SER_CP007_LOCALES) {
  const script = scriptFor(locale);
  const otherScript = otherScriptFor(locale);
  for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
    for (const seed of [1, 2, 3]) {
      const english = generateSerCp007PermanentEnglishPackage(
        probe.temporaryTemplateId,
        seed,
      );
      const localized = generateSerCp007PermanentLocalizedPackage(
        probe.temporaryTemplateId,
        locale,
        seed,
      );
      const repeated = generateSerCp007PermanentLocalizedPackage(
        probe.temporaryTemplateId,
        locale,
        seed,
      );
      const regenerated = regenerateSerCp007PermanentLocalizedPackage({
        temporaryTemplateId: probe.temporaryTemplateId,
        locale,
        seed,
        subtypeId: localized.frozenTemplateAuthority.subtypeId,
        learnerRenderer: localized.frozenTemplateAuthority.learnerRenderer,
      });

      assert.deepEqual(localized, repeated);
      assert.deepEqual(localized, regenerated);
      deterministicProofs += 1;

      assert.equal(localized.permanentQlId, english.permanentQlId);
      assert.equal(localized.temporaryTemplateId, english.temporaryTemplateId);
      assert.equal(localized.seed, english.seed);
      assert.equal(localized.locale, locale);
      assert.equal(localized.question.locale, locale);
      assert.equal(lastLine(localized.question.stem), lastLine(english.question.stem));
      assert.notEqual(localized.question.stem, english.question.stem);
      reachedQls.add(localized.permanentQlId);

      assert.deepEqual(localized.question.options, english.question.options);
      assert.equal(localized.question.correctIndex, english.question.correctIndex);
      assert.equal(localized.question.correctAnswer, english.question.correctAnswer);
      assert.deepEqual(localized.question.hiddenState, english.question.hiddenState);
      answerOptionParityProofs += 1;

      assert.equal(localized.review.editorialTaskKind, english.review.editorialTaskKind);
      assert.equal(localized.review.proofModel, english.review.proofModel);
      assert.equal(localized.review.difficulty, english.review.difficulty);
      assert.equal(localized.review.releaseTier, english.review.releaseTier);
      assert.equal(
        localized.review.standardMockEligible,
        english.review.standardMockEligible,
      );
      assert.equal(
        localized.review.studentReleasePoolKey,
        english.review.studentReleasePoolKey,
      );
      assert.equal(localized.review.explanationMode, english.review.explanationMode);
      assert.deepEqual(localized.review.examSuitability, english.review.examSuitability);
      assert.deepEqual(localized.review.structuralDepth, english.review.structuralDepth);
      assert.equal(
        localized.review.workedSteps.length,
        english.review.workedSteps.length,
      );
      explanationParityProofs += 1;

      assert.equal(
        localized.review.renderingContract?.kind ?? null,
        english.review.renderingContract?.kind ?? null,
      );
      if (localized.review.renderingContract) {
        assert.match(
          localized.review.renderingContract.accessibleDescription,
          script,
        );
        assert.doesNotMatch(
          localized.review.renderingContract.accessibleDescription,
          otherScript,
        );
      }
      rendererParityProofs += 1;

      const text = learnerText(localized);
      assert.match(localized.question.stem.split("\n")[0] ?? "", script);
      assert.match(localized.review.conciseReview, script);
      assert.match(localized.review.expandedReview, script);
      assert.match(localized.question.explanation.rule, script);
      assert.match(localized.question.explanation.conclusion, script);
      scriptProofs += 1;

      assert.doesNotMatch(localized.question.stem, otherScript);
      assert.doesNotMatch(text, otherScript);
      mixedScriptProofs += 1;

      for (const pattern of localized.review.localizationDiagnostics
        .fallbackSourceLines) {
        fallbackPatterns.get(locale)!.add(pattern);
      }
      for (const word of leakedWords(text)) {
        englishLeaks.get(locale)!.add(word);
      }

      if (locale === "pa-IN") {
        assert.doesNotMatch(localized.question.stem, /ਪਦ/);
        assert.doesNotMatch(text, /ਪਦ/);
      }

      assert.equal(localized.lifecycle.active, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      assert.equal(
        localized.lifecycle.localizationStatus,
        "IMPLEMENTED_PENDING_MANUAL_REVIEW",
      );
      lifecycleLockProofs += 1;
      localizedPackages += 1;
    }
  }
}

const fallbackSummary = Object.fromEntries(
  [...fallbackPatterns].map(([locale, values]) => [locale, [...values].sort()]),
);
const leakSummary = Object.fromEntries(
  [...englishLeaks].map(([locale, values]) => [locale, [...values].sort()]),
);
const fallbackCount = [...fallbackPatterns.values()].reduce(
  (total, values) => total + values.size,
  0,
);
const leakCount = [...englishLeaks.values()].reduce(
  (total, values) => total + values.size,
  0,
);

assert.equal(localizedPackages, 840);
assert.equal(reachedQls.size, 13);
assert.equal(
  fallbackCount,
  0,
  `Untranslated localization patterns remain:\n${JSON.stringify(fallbackSummary, null, 2)}`,
);
assert.equal(
  leakCount,
  0,
  `English learner prose remains:\n${JSON.stringify(leakSummary, null, 2)}`,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_HINDI_PUNJABI_LOCALIZATION_PARITY_CANDIDATE",
      locales: SER_CP007_LOCALES,
      templates: SER_CP007_TEMPLATE_PROBES_V71.length,
      seedsPerTemplate: 3,
      localizedPackages,
      permanentQlsReached: reachedQls.size,
      deterministicProofs,
      answerOptionParityProofs,
      explanationParityProofs,
      rendererParityProofs,
      scriptProofs,
      mixedScriptProofs,
      lifecycleLockProofs,
      fallbackPatterns: fallbackSummary,
      englishProseLeaks: leakSummary,
      localizationStatus: "IMPLEMENTED_PENDING_NATIVE_LANGUAGE_MANUAL_REVIEW",
      lifecycle: {
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      },
      nextAuthority:
        "SER_CP007_HINDI_PUNJABI_NATIVE_LANGUAGE_MANUAL_REVIEW",
    },
    null,
    2,
  ),
);
