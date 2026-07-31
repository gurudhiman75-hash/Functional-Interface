import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001CalculationRichQuestion } from "./cp001-calculation-rich-explanation-runtime";
import {
  INT_CP001_CALCULATION_RICH_APPROVAL_ID,
  INT_CP001_CALCULATION_RICH_APPROVED_MATURITY,
  INT_CP001_CALCULATION_RICH_APPROVED_REVIEW_STATUS,
  generateIntCp001ApprovedCalculationRichQuestion,
} from "./cp001-calculation-rich-explanation-runtime-approved";

const LANGUAGES = ["en", "hi", "pa"] as const;
const SEEDS_PER_QL = 80;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const counters = {
  questions: 0,
  candidateToApprovedIdentityChecks: 0,
  deterministicApprovedChecks: 0,
  lifecycleChecks: 0,
  calculationContractChecks: 0,
  crossLanguageParityChecks: 0,
};

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (let seedIndex = 1; seedIndex <= SEEDS_PER_QL; seedIndex += 1) {
    const seed = `int-cp001-v6-approval:${qlId}:${seedIndex}`;
    const byLanguage = new Map<string, ReturnType<typeof generateIntCp001ApprovedCalculationRichQuestion>>();

    for (const language of LANGUAGES) {
      const candidate = generateIntCp001CalculationRichQuestion(qlId, seed, language);
      const approved = generateIntCp001ApprovedCalculationRichQuestion(qlId, seed, language);
      const replay = generateIntCp001ApprovedCalculationRichQuestion(qlId, seed, language);
      counters.questions += 1;

      assert(candidate.validation.ok && approved.validation.ok, `${qlId}/${seed}/${language}: invalid package.`);
      assert(stable(approved) === stable(replay), `${qlId}/${seed}/${language}: approved runtime is not deterministic.`);
      counters.deterministicApprovedChecks += 1;

      const frozenCandidate = {
        releaseId: candidate.releaseId,
        stem: candidate.stem,
        stemPresentation: candidate.stemPresentation,
        options: candidate.options,
        correctIndex: candidate.correctIndex,
        answerSemantic: candidate.answerSemantic,
        solveContract: candidate.solveContract,
        mathematicalFingerprint: candidate.mathematicalFingerprint,
        reasoningGraph: candidate.reasoningGraph,
        explanation: candidate.explanation,
        optionAudit: candidate.optionAudit,
        calculationRichTrace: candidate.calculationRichTrace,
        internalProvenance: candidate.internalProvenance,
        validation: candidate.validation,
      };
      const frozenApproved = {
        releaseId: approved.releaseId,
        stem: approved.stem,
        stemPresentation: approved.stemPresentation,
        options: approved.options,
        correctIndex: approved.correctIndex,
        answerSemantic: approved.answerSemantic,
        solveContract: approved.solveContract,
        mathematicalFingerprint: approved.mathematicalFingerprint,
        reasoningGraph: approved.reasoningGraph,
        explanation: approved.explanation,
        optionAudit: approved.optionAudit,
        calculationRichTrace: approved.calculationRichTrace,
        internalProvenance: approved.internalProvenance,
        validation: approved.validation,
      };
      assert(
        stable(frozenCandidate) === stable(frozenApproved),
        `${qlId}/${seed}/${language}: approval changed candidate content.`,
      );
      counters.candidateToApprovedIdentityChecks += 1;

      assert(approved.maturity === INT_CP001_CALCULATION_RICH_APPROVED_MATURITY, `${qlId}: maturity mismatch.`);
      assert(approved.reviewStatus === INT_CP001_CALCULATION_RICH_APPROVED_REVIEW_STATUS, `${qlId}: review mismatch.`);
      assert(approved.localeReviewStatus === "APPROVED_HUMAN_REVIEW", `${qlId}: locale approval mismatch.`);
      assert(approved.calculationRichApprovalTrace.approvalId === INT_CP001_CALCULATION_RICH_APPROVAL_ID, `${qlId}: approval trace mismatch.`);
      assert(approved.calculationRichApprovalTrace.approvalLifecycleOnly, `${qlId}: approval is not lifecycle-only.`);
      assert(approved.calculationRichApprovalTrace.candidateContentChanged === false, `${qlId}: content-change flag is unsafe.`);
      assert(approved.calculationRichApprovalTrace.approvedForActiveStaging, `${qlId}: active-staging approval missing.`);
      assert(approved.questionBankStatus === "NOT_STORED", `${qlId}: Question Bank lock changed.`);
      assert(approved.testEligibility === "INELIGIBLE", `${qlId}: test lock changed.`);
      assert(approved.publiclyPublishable === false, `${qlId}: publication lock changed.`);
      assert(approved.questionStudioDiscoverable === false, `${qlId}: Question Studio lock changed.`);
      counters.lifecycleChecks += 1;

      assert(approved.calculationRichTrace.workedStepCount >= 4, `${qlId}: fewer than four worked steps.`);
      assert(approved.calculationRichTrace.explicitFormula, `${qlId}: explicit formula flag missing.`);
      assert(approved.calculationRichTrace.explicitNumericSubstitution, `${qlId}: substitution flag missing.`);
      assert(approved.calculationRichTrace.explicitArithmetic, `${qlId}: arithmetic flag missing.`);
      assert(approved.explanation.stepByStep.steps.every((step) => /\d/u.test(step)), `${qlId}: a worked step lacks values.`);
      counters.calculationContractChecks += 1;
      byLanguage.set(language, approved);
    }

    const english = byLanguage.get("en")!;
    for (const language of ["hi", "pa"] as const) {
      const localized = byLanguage.get(language)!;
      assert(
        stable(localized.optionAudit.map((item) => item.result))
          === stable(english.optionAudit.map((item) => item.result)),
        `${qlId}/${seed}/${language}: option-value parity failed.`,
      );
      assert(localized.correctIndex === english.correctIndex, `${qlId}/${seed}/${language}: correct-index parity failed.`);
      assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${qlId}/${seed}/${language}: fingerprint parity failed.`);
      counters.crossLanguageParityChecks += 1;
    }
  }
}

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  approvalId: INT_CP001_CALCULATION_RICH_APPROVAL_ID,
  releases: {
    en: "INT-CP-001-EN-v6",
    hi: "INT-CP-001-HI-v6",
    pa: "INT-CP-001-PA-v6",
  },
  ...counters,
  activeStagingApproved: true,
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP001_CALCULATION_RICH_V6_APPROVAL");
