import { INT_CP001_FINAL_REGISTRY } from "./cp001-final-registry";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import {
  assertIntCp001ApprovedV2LocaleParity,
  generateIntCp001ApprovedV2LocalizedQuestion,
} from "./cp001-localized-runtime-v2-approved";
import { generateIntCp001DirectionAwareLocalizedQuestion } from "./cp001-localized-runtime-v2";
import { stableBigIntJson } from "./cp001-localization-foundation";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import {
  INT_CP001_HINDI_RELEASE_V2_ID,
  INT_CP001_PUNJABI_RELEASE_V2_ID,
} from "./cp001-multilingual-release-v2";

function fail(message: string): never {
  throw new Error(message);
}

function approvalInvariant(value: Record<string, unknown>): string {
  const {
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    localeReviewStatus: _localeReviewStatus,
    ...content
  } = value;
  return stableBigIntJson(content);
}

const locales: readonly IntCp001Locale[] = ["hi", "pa"];
let approvedQuestions = 0;
let candidateIdentityChecks = 0;
let englishParityChecks = 0;
let deterministicChecks = 0;
let lifecycleChecks = 0;
let distractorChecks = 0;

for (const entry of INT_CP001_FINAL_REGISTRY) {
  for (let index = 0; index < 80; index += 1) {
    const seed = `v2-approval-${index}`;
    const english = generateIntCp001FinalEditorialV3Question(entry.qlId, seed);
    if (!english.validation.ok) fail(`${entry.qlId}/${seed}/en: ${english.validation.errors.join(" | ")}`);

    for (const locale of locales) {
      const candidate = generateIntCp001DirectionAwareLocalizedQuestion(entry.qlId, seed, locale);
      const approved = generateIntCp001ApprovedV2LocalizedQuestion(entry.qlId, seed, locale);
      const repeat = generateIntCp001ApprovedV2LocalizedQuestion(entry.qlId, seed, locale);

      if (!candidate.validation.ok) fail(`${entry.qlId}/${seed}/${locale}/candidate: ${candidate.validation.errors.join(" | ")}`);
      if (!approved.validation.ok) fail(`${entry.qlId}/${seed}/${locale}/approved: ${approved.validation.errors.join(" | ")}`);

      if (stableBigIntJson(approved) !== stableBigIntJson(repeat)) {
        fail(`${entry.qlId}/${seed}/${locale} approved V2 output is not deterministic.`);
      }
      deterministicChecks += 1;

      if (
        approvalInvariant(candidate as unknown as Record<string, unknown>)
        !== approvalInvariant(approved as unknown as Record<string, unknown>)
      ) {
        fail(`${entry.qlId}/${seed}/${locale} approval changed content outside lifecycle fields.`);
      }
      candidateIdentityChecks += 1;

      assertIntCp001ApprovedV2LocaleParity(english, approved);
      englishParityChecks += 1;

      const expectedRelease = locale === "hi"
        ? INT_CP001_HINDI_RELEASE_V2_ID
        : INT_CP001_PUNJABI_RELEASE_V2_ID;
      if (approved.releaseId !== expectedRelease) fail(`${entry.qlId}/${seed}/${locale} has an incorrect V2 release ID.`);
      if (approved.maturity !== "APPROVED_MULTILINGUAL_CONTRACT_V2") fail(`${entry.qlId}/${seed}/${locale} has incorrect maturity.`);
      if (approved.reviewStatus !== "APPROVED_MULTILINGUAL_CONTRACT_V2") fail(`${entry.qlId}/${seed}/${locale} has incorrect review status.`);
      if (approved.localeReviewStatus !== "APPROVED_HUMAN_REVIEW") fail(`${entry.qlId}/${seed}/${locale} has incorrect locale review status.`);
      if (approved.questionBankStatus !== "NOT_STORED" || approved.testEligibility !== "INELIGIBLE") {
        fail(`${entry.qlId}/${seed}/${locale} breached storage/test locks.`);
      }
      if (approved.publiclyPublishable || approved.questionStudioDiscoverable) {
        fail(`${entry.qlId}/${seed}/${locale} breached publication/routing locks.`);
      }
      lifecycleChecks += 1;

      if (approved.options.length !== 4 || new Set(approved.options).size !== 4) {
        fail(`${entry.qlId}/${seed}/${locale} lacks four unique options.`);
      }
      if (approved.optionAudit[approved.correctIndex]?.misconceptionId !== "CORRECT") {
        fail(`${entry.qlId}/${seed}/${locale} lost correct-option ownership.`);
      }
      if (approved.explanation.trapAnalysis.items.length !== 3) {
        fail(`${entry.qlId}/${seed}/${locale} lacks three distractor analyses.`);
      }
      for (const trap of approved.explanation.trapAnalysis.items) {
        distractorChecks += 1;
        if (trap.optionNumber - 1 === approved.correctIndex) {
          fail(`${entry.qlId}/${seed}/${locale} analyses the correct option as a distractor.`);
        }
        if (trap.optionText !== approved.options[trap.optionNumber - 1]) {
          fail(`${entry.qlId}/${seed}/${locale} has an out-of-sync distractor option.`);
        }
      }

      approvedQuestions += 1;
    }
  }
}

if (approvedQuestions !== 3360) fail(`Expected 3360 approved V2 questions, received ${approvedQuestions}.`);

console.log(JSON.stringify({
  status: "PASS_INT_CP001_MULTILINGUAL_V2_APPROVAL",
  cpId: "INT-CP-001",
  qlCount: INT_CP001_FINAL_REGISTRY.length,
  seedsPerQl: 80,
  locales,
  approvedQuestions,
  candidateIdentityChecks,
  englishParityChecks,
  deterministicChecks,
  lifecycleChecks,
  distractorChecks,
  releases: {
    hi: INT_CP001_HINDI_RELEASE_V2_ID,
    pa: INT_CP001_PUNJABI_RELEASE_V2_ID,
  },
  maturity: "APPROVED_MULTILINGUAL_CONTRACT_V2",
  reviewStatus: "APPROVED_MULTILINGUAL_CONTRACT_V2",
  localeReviewStatus: "APPROVED_HUMAN_REVIEW",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
}, null, 2));
