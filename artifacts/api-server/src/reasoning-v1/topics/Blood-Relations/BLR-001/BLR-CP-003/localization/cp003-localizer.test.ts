import assert from "node:assert/strict";
import { generateBlrCp003FinalApprovedBank } from "../cp003-final-approved-bank";
import {
  BLR_CP003_HUMAN_REVIEW_BLOCKER,
  blrCp003CanonicalParityProjection,
  type GeneratedBlrCp003LocalizedQuestion,
} from "./cp003-localizer";
import type { BlrCp003TranslatedLocale } from "./cp003-language-pack";
import { localizeBlrCp003QuestionComplete } from "./cp003-localized-review-runtime";

const canonical = generateBlrCp003FinalApprovedBank();

function annotationSafe(value: string): string {
  return value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

function emitFailureAnnotation(title: string, message: string): void {
  console.error(`::error title=${annotationSafe(title)}::${annotationSafe(message)}`);
}

function buildLocale(locale: BlrCp003TranslatedLocale): readonly GeneratedBlrCp003LocalizedQuestion[] {
  const built: GeneratedBlrCp003LocalizedQuestion[] = [];
  const gaps = new Set<string>();
  for (const source of canonical) {
    try {
      built.push(localizeBlrCp003QuestionComplete(source, locale));
    } catch (error) {
      gaps.add(error instanceof Error ? error.message : String(error));
    }
  }
  if (gaps.size > 0) {
    const ordered = [...gaps].sort();
    console.error(JSON.stringify({ locale, localizationCoverageGaps: ordered }, null, 2));
    for (const [index, gap] of ordered.entries()) {
      emitFailureAnnotation(`CP003 ${locale} localization gap ${index + 1}/${ordered.length}`, gap);
    }
    assert.fail(`${locale}: ${gaps.size} localization coverage gaps remain.`);
  }
  return built;
}

const hindi = buildLocale("hi-IN");
const punjabi = buildLocale("pa-IN");

assert.equal(canonical.length, 298);
assert.equal(hindi.length, 298);
assert.equal(punjabi.length, 298);

const expectedQlCounts = {
  "BLR-QL-009": 108,
  "BLR-QL-010": 108,
  "BLR-QL-011": 66,
  "BLR-QL-012": 16,
};

for (const bank of [hindi, punjabi]) {
  assert.deepEqual(
    Object.fromEntries(Object.keys(expectedQlCounts).map((qlId) => [
      qlId,
      bank.filter((record) => record.qlId === qlId).length,
    ])),
    expectedQlCounts,
  );
  assert.equal(new Set(bank.map((record) => record.itemId)).size, 298);
  assert.equal(new Set(bank.map((record) => record.questionLanguageId)).size, 298);
  assert.ok(bank.every((record) => record.reviewOnly));
  assert.ok(bank.every((record) => !record.publiclyPublishable));
  assert.ok(bank.every((record) => !record.questionStudioVisible));
  assert.ok(bank.every((record) => !record.questionBankEligible));
  assert.ok(bank.every((record) => !record.mockTestEligible));
  assert.ok(bank.every((record) => !record.metadata.productDeliveryUnlocked));
  assert.ok(bank.every((record) => record.metadata.humanLanguageReviewRequired));
  assert.ok(bank.every((record) => record.metadata.activeEditorialBlockers.length === 1));
  assert.ok(bank.every((record) => record.metadata.activeEditorialBlockers[0] === BLR_CP003_HUMAN_REVIEW_BLOCKER));
}

function stripNames(text: string, source: (typeof canonical)[number]): string {
  let value = text;
  for (const node of source.proceduralLogic.nodes) value = value.split(node.label).join("");
  return value;
}

const forbiddenEnglish = /\b(?:study|following|married|unmarried|mother|father|son|daughter|children|child|siblings?|spouse|wife|husband|parents?|brother|sister|cousins?|which|select|option)\b/i;
const leakageForms = new Map<string, { locale: BlrCp003TranslatedLocale; itemId: string; canonical: string; localized: string }>();
const invariantFailures: Array<{ itemId: string; locale: BlrCp003TranslatedLocale; stage: string; detail: string }> = [];

function recordLeak(
  locale: BlrCp003TranslatedLocale,
  source: (typeof canonical)[number],
  localized: GeneratedBlrCp003LocalizedQuestion,
): void {
  const learnerText = stripNames(`${localized.sharedPrompt} ${localized.stem}`, source).replace(/\s+/g, " ").trim();
  if (!forbiddenEnglish.test(learnerText)) return;
  const canonicalText = stripNames(`${source.sharedPrompt} ${source.stem}`, source).replace(/\s+/g, " ").trim();
  const key = `${locale}|${canonicalText}|${learnerText}`;
  if (!leakageForms.has(key)) leakageForms.set(key, { locale, itemId: source.itemId, canonical: canonicalText, localized: learnerText });
}

function captureInvariant(
  source: (typeof canonical)[number],
  locale: BlrCp003TranslatedLocale,
  stage: string,
  check: () => void,
): void {
  try {
    check();
  } catch (error) {
    invariantFailures.push({
      itemId: source.itemId,
      locale,
      stage,
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

for (let index = 0; index < canonical.length; index += 1) {
  const source = canonical[index]!;
  const localizedByLocale = [
    ["hi-IN", hindi[index]!],
    ["pa-IN", punjabi[index]!],
  ] as const;

  for (const [locale, localized] of localizedByLocale) {
    captureInvariant(source, locale, "canonical-parity", () => {
      assert.deepEqual(blrCp003CanonicalParityProjection(localized), blrCp003CanonicalParityProjection(source));
    });
    captureInvariant(source, locale, "correct-index", () => assert.equal(localized.correctIndex, source.correctIndex));
    captureInvariant(source, locale, "answer-semantic-key", () => assert.equal(localized.answerSemanticKey, source.answerSemanticKey));
    captureInvariant(source, locale, "localized-script", () => {
      const learnerText = stripNames(`${localized.sharedPrompt} ${localized.stem}`, source);
      const script = locale === "hi-IN" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      assert.ok(script.test(learnerText), `${source.itemId}: ${locale} script missing`);
    });
    captureInvariant(source, locale, "canonical-fingerprint", () => {
      assert.equal(localized.metadata.canonicalSemanticFingerprint, source.metadata.semanticFingerprint);
    });
    captureInvariant(source, locale, "option-count", () => assert.equal(localized.options.length, 4));
    captureInvariant(source, locale, "option-analysis-count", () => assert.equal(localized.editorial.optionAnalysis.length, 4));
    recordLeak(locale, source, localized);
  }
}

if (invariantFailures.length > 0) {
  console.error(JSON.stringify({ invariantFailureCount: invariantFailures.length, invariantFailures }, null, 2));
  for (const [index, failure] of invariantFailures.slice(0, 40).entries()) {
    emitFailureAnnotation(
      `CP003 ${failure.locale} ${failure.stage} ${index + 1}/${Math.min(invariantFailures.length, 40)}`,
      `${failure.itemId} | ${failure.detail}`,
    );
  }
}

if (leakageForms.size > 0) {
  const leaks = [...leakageForms.values()];
  console.error(JSON.stringify({ forbiddenEnglishLeakFormCount: leakageForms.size, leakForms: leaks }, null, 2));
  for (const [index, leak] of leaks.slice(0, 40).entries()) {
    emitFailureAnnotation(
      `CP003 ${leak.locale} English leak ${index + 1}/${Math.min(leaks.length, 40)}`,
      `${leak.itemId} | canonical: ${leak.canonical} | localized: ${leak.localized}`,
    );
  }
}

if (invariantFailures.length > 0 || leakageForms.size > 0) {
  assert.fail(`${invariantFailures.length} invariant failures and ${leakageForms.size} forbidden-English localization forms remain.`);
}

console.log(JSON.stringify({
  verdict: "BLR_CP003_HI_PA_LOCALISATION_REVIEW_CANDIDATE_PROVED",
  canonicalCount: canonical.length,
  hindiCount: hindi.length,
  punjabiCount: punjabi.length,
  multilingualCandidateCount: hindi.length + punjabi.length,
  qlCounts: expectedQlCounts,
  semanticParity: true,
  humanLanguageReviewRequired: true,
  productDeliveryUnlocked: false,
}, null, 2));
