import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import {
  generateIntCp001ApprovedCloseDistractorEnglishQuestion,
  generateIntCp001ApprovedCloseDistractorLocalizedQuestion,
} from "./cp001-close-distractor-runtime-approved";
import { stableBigIntJson } from "./cp001-localization-foundation";
import {
  generateIntCp001ExplanationSanitizationQuestion,
  generateIntCp001SanitizedLocalizedQuestion,
  INT_CP001_EXPLANATION_SANITIZATION_PATCH_ID,
  INT_CP001_EXPLANATION_SANITIZATION_REVIEW_STATUS,
  INT_CP001_EXPLANATION_SANITIZATION_STATUS,
  validateIntCp001SanitizedExplanation,
  type IntCp001ExplanationSanitizationLanguage,
} from "./cp001-explanation-sanitization-runtime";

function fail(message: string): never {
  throw new Error(message);
}

function same(label: string, left: unknown, right: unknown): void {
  if (stableBigIntJson(left) !== stableBigIntJson(right)) fail(`${label} drifted.`);
}

const languages: readonly IntCp001ExplanationSanitizationLanguage[] = ["en", "hi", "pa"];
const seedCount = 80;
const expectedReleases = {
  en: "INT-CP-001-EN-v5",
  hi: "INT-CP-001-HI-v5",
  pa: "INT-CP-001-PA-v5",
} as const;

if (listQuantV4Packages().some((item) => String(item.packageId) === "INT-001")) {
  fail("INT-001 entered the central Question Studio registry during explanation remediation.");
}

let generatedQuestions = 0;
let deterministicChecks = 0;
let contentIdentityChecks = 0;
let lifecycleChecks = 0;
let mathSanitizationChecks = 0;
let crossLanguageParityChecks = 0;
let currencyTokensRemoved = 0;
let redundantPercentTokensRemoved = 0;
const qlCoverage = Object.fromEntries(languages.map((language) => [language, new Set<string>()])) as Record<
  IntCp001ExplanationSanitizationLanguage,
  Set<string>
>;
const answerPositions = Object.fromEntries(languages.map((language) => [language, [0, 0, 0, 0]])) as Record<
  IntCp001ExplanationSanitizationLanguage,
  number[]
>;

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (let seedIndex = 1; seedIndex <= seedCount; seedIndex += 1) {
    const seed = `explanation-sanitization-v1:${qlId}:${seedIndex}`;
    const english = generateIntCp001ExplanationSanitizationQuestion(qlId, seed, "en");
    const englishAgain = generateIntCp001ExplanationSanitizationQuestion(qlId, seed, "en");
    const approvedEnglish = generateIntCp001ApprovedCloseDistractorEnglishQuestion(qlId, seed);

    same(`${qlId}/${seed}/en deterministic`, english, englishAgain);
    same(`${qlId}/${seed}/en approved identity`, english, approvedEnglish);
    deterministicChecks += 1;
    contentIdentityChecks += 1;

    if (english.releaseId !== expectedReleases.en) fail(`${qlId}/${seed}/en emitted ${english.releaseId}.`);
    if (!english.validation.ok) fail(`${qlId}/${seed}/en failed validation: ${english.validation.errors.join(" | ")}`);
    if (english.questionBankStatus !== "NOT_STORED" || english.testEligibility !== "INELIGIBLE") {
      fail(`${qlId}/${seed}/en downstream lifecycle changed.`);
    }
    if (english.publiclyPublishable || english.questionStudioDiscoverable) {
      fail(`${qlId}/${seed}/en became publishable or discoverable.`);
    }
    lifecycleChecks += 1;
    generatedQuestions += 1;
    qlCoverage.en.add(qlId);
    answerPositions.en[english.correctIndex] += 1;

    for (const locale of ["hi", "pa"] as const) {
      const approved = generateIntCp001ApprovedCloseDistractorLocalizedQuestion(qlId, seed, locale);
      const candidate = generateIntCp001SanitizedLocalizedQuestion(qlId, seed, locale);
      const candidateAgain = generateIntCp001SanitizedLocalizedQuestion(qlId, seed, locale);

      same(`${qlId}/${seed}/${locale} deterministic`, candidate, candidateAgain);
      deterministicChecks += 1;

      same(`${qlId}/${seed}/${locale} stem`, candidate.stem, approved.stem);
      same(`${qlId}/${seed}/${locale} stem presentation`, candidate.stemPresentation, approved.stemPresentation);
      same(`${qlId}/${seed}/${locale} options`, candidate.options, approved.options);
      same(`${qlId}/${seed}/${locale} option audit`, candidate.optionAudit, approved.optionAudit);
      same(`${qlId}/${seed}/${locale} correct index`, candidate.correctIndex, approved.correctIndex);
      same(`${qlId}/${seed}/${locale} reasoning graph`, candidate.reasoningGraph, approved.reasoningGraph);
      same(`${qlId}/${seed}/${locale} mathematical fingerprint`, candidate.mathematicalFingerprint, approved.mathematicalFingerprint);
      same(`${qlId}/${seed}/${locale} internal provenance`, candidate.internalProvenance, approved.internalProvenance);
      contentIdentityChecks += 8;

      if (candidate.releaseId !== expectedReleases[locale]) {
        fail(`${qlId}/${seed}/${locale} emitted ${candidate.releaseId}.`);
      }
      if (candidate.maturity !== INT_CP001_EXPLANATION_SANITIZATION_STATUS) {
        fail(`${qlId}/${seed}/${locale} has wrong candidate maturity.`);
      }
      if (candidate.reviewStatus !== INT_CP001_EXPLANATION_SANITIZATION_REVIEW_STATUS) {
        fail(`${qlId}/${seed}/${locale} has wrong review status.`);
      }
      if (candidate.localeReviewStatus !== "PENDING_HUMAN_REVIEW") {
        fail(`${qlId}/${seed}/${locale} bypassed human review.`);
      }
      if (candidate.questionBankStatus !== "NOT_STORED" || candidate.testEligibility !== "INELIGIBLE") {
        fail(`${qlId}/${seed}/${locale} downstream lifecycle changed.`);
      }
      if (candidate.publiclyPublishable || candidate.questionStudioDiscoverable) {
        fail(`${qlId}/${seed}/${locale} became publishable or discoverable.`);
      }
      if (!candidate.validation.ok) {
        fail(`${qlId}/${seed}/${locale}: ${candidate.validation.errors.join(" | ")}`);
      }
      if (candidate.explanationSanitizationTrace.patchId !== INT_CP001_EXPLANATION_SANITIZATION_PATCH_ID) {
        fail(`${qlId}/${seed}/${locale} has wrong patch trace.`);
      }
      if (candidate.explanationSanitizationTrace.canonicalStemChanged
        || candidate.explanationSanitizationTrace.optionValuesChanged
        || candidate.explanationSanitizationTrace.correctIndexChanged) {
        fail(`${qlId}/${seed}/${locale} reports forbidden content drift.`);
      }
      lifecycleChecks += 1;

      const sanitationErrors = validateIntCp001SanitizedExplanation(candidate.explanation);
      if (sanitationErrors.length > 0) fail(`${qlId}/${seed}/${locale}: ${sanitationErrors.join(" | ")}`);
      mathSanitizationChecks += 1;
      currencyTokensRemoved += candidate.explanationSanitizationTrace.learnerMathCurrencyTokensRemoved;
      redundantPercentTokensRemoved += candidate.explanationSanitizationTrace.redundantRatePercentTokensRemoved;

      same(
        `${qlId}/${seed}/${locale} option-value parity`,
        candidate.optionAudit.map((item) => item.result),
        english.optionAudit.map((item) => item.result),
      );
      if (candidate.correctIndex !== english.correctIndex) {
        fail(`${qlId}/${seed}/${locale} correct-index parity drifted.`);
      }
      crossLanguageParityChecks += 1;

      generatedQuestions += 1;
      qlCoverage[locale].add(qlId);
      answerPositions[locale][candidate.correctIndex] += 1;
    }
  }
}

const expectedQuestions = INT_CP001_FINAL_QL_IDS.length * seedCount * languages.length;
if (generatedQuestions !== expectedQuestions) fail(`Generated ${generatedQuestions}; expected ${expectedQuestions}.`);
if (currencyTokensRemoved === 0) fail("No localized currency-in-math defects were exercised.");
if (redundantPercentTokensRemoved === 0) fail("No redundant localized percent substitutions were exercised.");
for (const language of languages) {
  if (qlCoverage[language].size !== INT_CP001_FINAL_QL_IDS.length) {
    fail(`${language} covered only ${qlCoverage[language].size} QLs.`);
  }
  if (answerPositions[language].some((count) => count === 0)) {
    fail(`${language} did not cover all answer positions.`);
  }
}

const summary = {
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  patchId: INT_CP001_EXPLANATION_SANITIZATION_PATCH_ID,
  questions: generatedQuestions,
  deterministicChecks,
  contentIdentityChecks,
  lifecycleChecks,
  mathSanitizationChecks,
  crossLanguageParityChecks,
  currencyTokensRemoved,
  redundantPercentTokensRemoved,
  releases: expectedReleases,
  qlCoverage: Object.fromEntries(languages.map((language) => [language, qlCoverage[language].size])),
  answerPositions,
  enabled: false,
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP001_EXPLANATION_SANITIZATION_V1");
