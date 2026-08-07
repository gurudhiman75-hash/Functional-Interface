import assert from "node:assert/strict";
import { SER_CP007_TEMPLATE_PROBES_V71 } from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import { generateSerCp007PermanentEnglishPackage } from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-permanent-runtime";
import {
  generateSerCp007PermanentLocalizedPackage,
  regenerateSerCp007PermanentLocalizedPackage,
  SER_CP007_LOCALES,
  type SerCp007Locale,
} from "./ser-cp-007-localized-runtime";

const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const ALLOWED_ASCII_WORDS = new Set([
  "details",
  "summary",
  "strong",
  "st",
  "nd",
  "rd",
  "th",
]);

function expectedScript(locale: SerCp007Locale): RegExp {
  return locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
}

function seriesLine(stem: string): string {
  return stem.split("\n").at(-1)?.trim() ?? "";
}

function unexpectedAsciiProse(text: string): readonly string[] {
  const words = text.match(/[A-Za-z]+/g) ?? [];
  return words.filter((word) => {
    if (word.length === 1) return false;
    if (ALLOWED_ASCII_WORDS.has(word.toLowerCase())) return false;
    if (word === word.toUpperCase()) return false;
    const uppercaseCount = [...word].filter((character) => /[A-Z]/.test(character)).length;
    const lowercaseCount = [...word].filter((character) => /[a-z]/.test(character)).length;
    if (uppercaseCount >= 2 && lowercaseCount >= 1) return false;
    return true;
  });
}

let packageProofs = 0;
let deterministicProofs = 0;
let answerOptionParityProofs = 0;
let explanationParityProofs = 0;
let rendererParityProofs = 0;
let lifecycleLockProofs = 0;
const reachedPermanentQls = new Set<string>();
const fallbackByLocale = new Map<SerCp007Locale, Set<string>>(
  SER_CP007_LOCALES.map((locale) => [locale, new Set<string>()]),
);
const englishLeakByLocale = new Map<SerCp007Locale, Set<string>>(
  SER_CP007_LOCALES.map((locale) => [locale, new Set<string>()]),
);
const englishLeakLinesByLocale = new Map<SerCp007Locale, Set<string>>(
  SER_CP007_LOCALES.map((locale) => [locale, new Set<string>()]),
);

function recordEnglishLeaks(input: {
  readonly locale: SerCp007Locale;
  readonly temporaryTemplateId: string;
  readonly seed: number;
  readonly text: string;
}): void {
  for (const line of input.text.split("\n")) {
    const words = unexpectedAsciiProse(line);
    if (words.length === 0) continue;
    for (const word of words) englishLeakByLocale.get(input.locale)!.add(word);
    englishLeakLinesByLocale.get(input.locale)!.add(
      `${input.temporaryTemplateId}:${input.seed} :: ${line.trim()}`,
    );
  }
}

for (const locale of SER_CP007_LOCALES) {
  const script = expectedScript(locale);
  for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
    for (const seed of [1, 2, 3]) {
      const english = generateSerCp007PermanentEnglishPackage(
        probe.temporaryTemplateId,
        seed,
      );
      const first = generateSerCp007PermanentLocalizedPackage(
        probe.temporaryTemplateId,
        locale,
        seed,
      );
      const second = generateSerCp007PermanentLocalizedPackage(
        probe.temporaryTemplateId,
        locale,
        seed,
      );
      const regenerated = regenerateSerCp007PermanentLocalizedPackage({
        temporaryTemplateId: probe.temporaryTemplateId,
        locale,
        seed,
        subtypeId: first.frozenTemplateAuthority.subtypeId,
        learnerRenderer: first.frozenTemplateAuthority.learnerRenderer,
      });

      assert.deepEqual(first, second);
      assert.deepEqual(first, regenerated);
      deterministicProofs += 1;

      assert.equal(first.permanentQlId, english.permanentQlId);
      assert.equal(first.temporaryTemplateId, english.temporaryTemplateId);
      assert.equal(first.seed, english.seed);
      assert.equal(first.locale, locale);
      assert.equal(first.question.locale, locale);
      assert.equal(seriesLine(first.question.stem), seriesLine(english.question.stem));
      assert.notEqual(first.question.stem, english.question.stem);
      assert.match(first.question.stem.split("\n")[0] ?? "", script);
      reachedPermanentQls.add(first.permanentQlId);

      assert.deepEqual(first.question.options, english.question.options);
      assert.equal(first.question.correctIndex, english.question.correctIndex);
      assert.equal(first.question.correctAnswer, english.question.correctAnswer);
      assert.deepEqual(first.question.hiddenState, english.question.hiddenState);
      answerOptionParityProofs += 1;

      assert.equal(first.review.editorialTaskKind, english.review.editorialTaskKind);
      assert.equal(first.review.proofModel, english.review.proofModel);
      assert.equal(first.review.difficulty, english.review.difficulty);
      assert.equal(first.review.releaseTier, english.review.releaseTier);
      assert.equal(first.review.standardMockEligible, english.review.standardMockEligible);
      assert.equal(first.review.studentReleasePoolKey, english.review.studentReleasePoolKey);
      assert.equal(first.review.explanationMode, english.review.explanationMode);
      assert.deepEqual(first.review.examSuitability, english.review.examSuitability);
      assert.deepEqual(first.review.structuralDepth, english.review.structuralDepth);
      assert.match(first.review.conciseReview, script);
      assert.match(first.review.expandedReview, script);
      assert.match(first.question.explanation.rule, script);
      assert.match(first.question.explanation.conclusion, script);
      assert.ok(first.review.workedSteps.length > 0);
      assert.equal(
        first.review.workedSteps.length,
        english.review.workedSteps.length,
      );
      explanationParityProofs += 1;

      assert.equal(
        first.review.renderingContract?.kind ?? null,
        english.review.renderingContract?.kind ?? null,
      );
      if (first.review.renderingContract) {
        assert.match(first.review.renderingContract.accessibleDescription, script);
      }
      rendererParityProofs += 1;

      for (const source of first.review.localizationDiagnostics.fallbackSourceLines) {
        fallbackByLocale.get(locale)!.add(source);
      }
      recordEnglishLeaks({
        locale,
        temporaryTemplateId: probe.temporaryTemplateId,
        seed,
        text: first.review.conciseReview,
      });
      recordEnglishLeaks({
        locale,
        temporaryTemplateId: probe.temporaryTemplateId,
        seed,
        text: first.review.expandedReview,
      });

      if (locale === "pa-IN") {
        assert.ok(!first.question.stem.includes("ਪਦ"));
        assert.ok(!first.review.conciseReview.includes("ਪਦ"));
        assert.ok(!first.review.expandedReview.includes("ਪਦ"));
      }

      assert.equal(first.lifecycle.active, false);
      assert.equal(first.lifecycle.questionStudioDiscoverable, false);
      assert.equal(first.lifecycle.questionBankWritable, false);
      assert.equal(first.lifecycle.testEligible, false);
      assert.equal(first.lifecycle.publiclyPublishable, false);
      assert.equal(
        first.lifecycle.localizationStatus,
        "IMPLEMENTED_PENDING_MANUAL_REVIEW",
      );
      lifecycleLockProofs += 1;
      packageProofs += 1;
    }
  }
}

const fallbackSummary = Object.fromEntries(
  [...fallbackByLocale].map(([locale, values]) => [locale, [...values].sort()]),
);
const englishLeakSummary = Object.fromEntries(
  [...englishLeakByLocale].map(([locale, values]) => [locale, [...values].sort()]),
);
const englishLeakLineSummary = Object.fromEntries(
  [...englishLeakLinesByLocale].map(([locale, values]) => [
    locale,
    [...values].sort(),
  ]),
);

assert.equal(packageProofs, 840);
assert.equal(reachedPermanentQls.size, 13);
assert.equal(
  [...fallbackByLocale.values()].reduce((total, values) => total + values.size, 0),
  0,
  `Untranslated localization patterns remain:\n${JSON.stringify(fallbackSummary, null, 2)}`,
);
assert.equal(
  [...englishLeakByLocale.values()].reduce((total, values) => total + values.size, 0),
  0,
  `English prose leaked into localized reviews:\n${JSON.stringify(
    { words: englishLeakSummary, lines: englishLeakLineSummary },
    null,
    2,
  )}`,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_HINDI_PUNJABI_LOCALIZATION_PARITY_CANDIDATE",
      locales: SER_CP007_LOCALES,
      templates: SER_CP007_TEMPLATE_PROBES_V71.length,
      seedsPerTemplate: 3,
      localizedPackages: packageProofs,
      permanentQlsReached: reachedPermanentQls.size,
      deterministicProofs,
      answerOptionParityProofs,
      explanationParityProofs,
      rendererParityProofs,
      lifecycleLockProofs,
      fallbackPatterns: fallbackSummary,
      englishProseLeaks: englishLeakSummary,
      englishProseLeakLines: englishLeakLineSummary,
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