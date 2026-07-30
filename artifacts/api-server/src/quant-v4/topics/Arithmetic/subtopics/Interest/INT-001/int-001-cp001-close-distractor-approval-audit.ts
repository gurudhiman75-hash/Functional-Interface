import {
  INT_CP001_FINAL_QL_IDS,
  type IntCp001FinalQlId,
} from "./cp001-final-registry";
import {
  generateIntCp001CloseDistractorEnglishQuestion as generateCandidateEnglish,
  generateIntCp001CloseDistractorLocalizedQuestion as generateCandidateLocalized,
} from "./cp001-close-distractor-runtime-v2";
import {
  generateIntCp001ApprovedCloseDistractorEnglishQuestion,
  generateIntCp001ApprovedCloseDistractorLocalizedQuestion,
  INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS,
} from "./cp001-close-distractor-runtime-approved";
import { rationalKey } from "./foundation/rational";
import { isRational } from "./cp001-localization-foundation";

const languages = ["en", "hi", "pa"] as const;
type Language = (typeof languages)[number];

function fail(message: string): never {
  throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function withoutApprovalLifecycle(value: Record<string, unknown>): Record<string, unknown> {
  const {
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    localeReviewStatus: _localeReviewStatus,
    ...rest
  } = value;
  return rest;
}

function candidate(qlId: IntCp001FinalQlId, seed: string, language: Language) {
  return language === "en"
    ? generateCandidateEnglish(qlId, seed)
    : generateCandidateLocalized(qlId, seed, language);
}

function approved(qlId: IntCp001FinalQlId, seed: string, language: Language) {
  return language === "en"
    ? generateIntCp001ApprovedCloseDistractorEnglishQuestion(qlId, seed)
    : generateIntCp001ApprovedCloseDistractorLocalizedQuestion(qlId, seed, language);
}

function optionResultKeys(item: ReturnType<typeof approved>): string[] {
  return item.optionAudit.map((audit) => {
    if (!isRational(audit.result.value)) fail(`${item.qlId}/${item.seed}: non-rational option result.`);
    return `${audit.result.semantic}:${rationalKey(audit.result.value)}`;
  });
}

const seeds = Array.from({ length: 80 }, (_item, index) => `close-distractor-${index}`);
let generatedApprovedQuestions = 0;
let candidateIdentityChecks = 0;
let deterministicChecks = 0;
let lifecycleChecks = 0;
let multilingualParityChecks = 0;
let approvedWrongOptions = 0;
const byLanguage: Record<Language, { generated: number; wrongOptions: number }> = {
  en: { generated: 0, wrongOptions: 0 },
  hi: { generated: 0, wrongOptions: 0 },
  pa: { generated: 0, wrongOptions: 0 },
};

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (const seed of seeds) {
    const approvedByLanguage = new Map<Language, ReturnType<typeof approved>>();

    for (const language of languages) {
      const reviewedCandidate = candidate(qlId, seed, language);
      const approvedItem = approved(qlId, seed, language);
      const repeated = approved(qlId, seed, language);
      approvedByLanguage.set(language, approvedItem);

      generatedApprovedQuestions += 1;
      byLanguage[language].generated += 1;

      if (stable(approvedItem) !== stable(repeated)) {
        fail(`${qlId}/${seed}/${language}: approved generation is not deterministic.`);
      }
      deterministicChecks += 1;

      if (
        stable(withoutApprovalLifecycle(approvedItem as unknown as Record<string, unknown>))
        !== stable(withoutApprovalLifecycle(reviewedCandidate as unknown as Record<string, unknown>))
      ) {
        fail(`${qlId}/${seed}/${language}: approved wrapper changed reviewed candidate content.`);
      }
      candidateIdentityChecks += 1;

      if (
        approvedItem.maturity !== INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS
        || approvedItem.reviewStatus !== INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS
        || approvedItem.localeReviewStatus !== "APPROVED_HUMAN_REVIEW"
        || approvedItem.questionBankStatus !== "NOT_STORED"
        || approvedItem.testEligibility !== "INELIGIBLE"
        || approvedItem.publiclyPublishable
        || approvedItem.questionStudioDiscoverable
      ) {
        fail(`${qlId}/${seed}/${language}: approved lifecycle lock is invalid.`);
      }
      lifecycleChecks += 1;

      const wrongOptions = approvedItem.optionAudit.filter((_audit, index) => index !== approvedItem.correctIndex).length;
      if (wrongOptions !== 3) fail(`${qlId}/${seed}/${language}: expected three wrong options.`);
      approvedWrongOptions += wrongOptions;
      byLanguage[language].wrongOptions += wrongOptions;
    }

    const english = approvedByLanguage.get("en")!;
    for (const language of ["hi", "pa"] as const) {
      const localized = approvedByLanguage.get(language)!;
      if (localized.correctIndex !== english.correctIndex) {
        fail(`${qlId}/${seed}/${language}: approved correct position drifted from English.`);
      }
      if (stable(optionResultKeys(localized)) !== stable(optionResultKeys(english))) {
        fail(`${qlId}/${seed}/${language}: approved option values or positions drifted from English.`);
      }
      multilingualParityChecks += 1;
    }
  }
}

console.log(JSON.stringify({
  packageId: "INT-001",
  cpId: "INT-CP-001",
  approvalStatus: INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS,
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  seedCount: seeds.length,
  languageCount: languages.length,
  generatedApprovedQuestions,
  candidateIdentityChecks,
  deterministicChecks,
  lifecycleChecks,
  multilingualParityChecks,
  approvedWrongOptions,
  byLanguage,
  status: "PASS",
}, null, 2));
