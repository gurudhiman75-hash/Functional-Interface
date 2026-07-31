import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { stableBigIntJson } from "./cp001-localization-foundation";
import { generateIntCp001CalculationRichQuestion } from "./cp001-calculation-rich-explanation-runtime";
import {
  generateIntCp001ApprovedCalculationRichQuestion,
  INT_CP001_CALCULATION_RICH_APPROVAL_ID,
  INT_CP001_CALCULATION_RICH_APPROVED_STATUS,
} from "./cp001-calculation-rich-explanation-runtime-approved";

const languages = ["en", "hi", "pa"] as const;
const seedsPerQl = 80;
let approvedQuestions = 0;
let identityChecks = 0;
let lifecycleChecks = 0;
let parityChecks = 0;

if (listQuantV4Packages().some((item) => String(item.packageId) === "INT-001")) {
  throw new Error("INT-001 must remain absent from the central Question Studio registry.");
}

function stripApproval(value: Record<string, unknown>): Record<string, unknown> {
  const {
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    localeReviewStatus: _localeReviewStatus,
    calculationRichApprovalTrace: _approval,
    ...rest
  } = value;
  return rest;
}

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `calculation-rich-v6-approval:${qlId}:${index}`;
    const generated = Object.fromEntries(languages.map((language) => [
      language,
      generateIntCp001ApprovedCalculationRichQuestion(qlId, seed, language),
    ])) as Record<(typeof languages)[number], ReturnType<typeof generateIntCp001ApprovedCalculationRichQuestion>>;

    for (const language of languages) {
      const candidate = generateIntCp001CalculationRichQuestion(qlId, seed, language);
      const approved = generated[language];
      approvedQuestions += 1;
      if (stableBigIntJson(stripApproval(approved as unknown as Record<string, unknown>)) !== stableBigIntJson(stripApproval(candidate as unknown as Record<string, unknown>))) {
        throw new Error(`${qlId}/${seed}/${language}: approval changed learner content.`);
      }
      identityChecks += 1;
      if (
        approved.maturity !== INT_CP001_CALCULATION_RICH_APPROVED_STATUS
        || approved.reviewStatus !== INT_CP001_CALCULATION_RICH_APPROVED_STATUS
        || approved.localeReviewStatus !== "APPROVED_HUMAN_REVIEW"
        || approved.calculationRichApprovalTrace.approvalId !== INT_CP001_CALCULATION_RICH_APPROVAL_ID
        || approved.calculationRichApprovalTrace.learnerContentChangedDuringApproval
        || approved.questionBankStatus !== "NOT_STORED"
        || approved.testEligibility !== "INELIGIBLE"
        || approved.publiclyPublishable
        || approved.questionStudioDiscoverable
      ) {
        throw new Error(`${qlId}/${seed}/${language}: approval lifecycle mismatch.`);
      }
      lifecycleChecks += 1;
    }

    for (const language of ["hi", "pa"] as const) {
      if (generated[language].correctIndex !== generated.en.correctIndex || stableBigIntJson(generated[language].optionAudit.map((item) => item.result)) !== stableBigIntJson(generated.en.optionAudit.map((item) => item.result))) {
        throw new Error(`${qlId}/${seed}/${language}: multilingual parity drifted.`);
      }
      parityChecks += 1;
    }
  }
}

console.log(JSON.stringify({
  approvalId: INT_CP001_CALCULATION_RICH_APPROVAL_ID,
  releases: ["INT-CP-001-EN-v6", "INT-CP-001-HI-v6", "INT-CP-001-PA-v6"],
  approvedQuestions,
  identityChecks,
  lifecycleChecks,
  parityChecks,
  enabled: false,
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP001_CALCULATION_RICH_V6_APPROVAL");
