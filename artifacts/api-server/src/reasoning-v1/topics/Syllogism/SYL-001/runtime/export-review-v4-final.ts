import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import "./export-review-v4";
import "./export-evidence-v4";

const outputDir = process.env.SYL_REVIEW_V4_DIR
  ? resolve(process.env.SYL_REVIEW_V4_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-review-v4-final");

const reportPath = resolve(outputDir, "syl-001-v4-remediation-report.json");
const evidencePath = resolve(outputDir, "syl-001-v4-evidence-summary.json");
const report = JSON.parse(readFileSync(reportPath, "utf8"));
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));

const repeated = report.repeatedContentRemoved ?? {};
const finalReport = {
  ...report,
  schemaVersion: "syl-learner-v4-remediated-evidence-v2",
  reportPurpose: "Transformation summary plus record-level automated evidence. Human logic, native editorial and viewport approval remain separate gates.",
  learnerSurfaceTransformation: {
    recordsConvertedFromMandatorySevenSectionTemplate: repeated.mandatorySevenSectionRecordsRemoved ?? 0,
    duplicateFinalAnswerBlocksRemoved: repeated.duplicateFinalAnswerBlocksRemoved ?? 0,
    learnerFacingPremiseIdRowsRemoved: repeated.learnerFacingPremiseIdRowsRemoved ?? 0,
    learnerFacingReasonCodeRowsRemoved: repeated.learnerFacingReasonCodeRowsRemoved ?? 0,
  },
  repeatedContentRemoved: undefined,
  explanationLength: {
    ...report.explanationLength,
    averageExpandedLearnerWords: evidence.learnerLengthEvidence.averageExpandedLearnerWords,
    averageDiagramLabelWords: evidence.learnerLengthEvidence.averageDiagramLabelWords,
    averageTotalLearnerWords: evidence.learnerLengthEvidence.averageTotalLearnerWords,
    measurementDefinitions: {
      primaryVisibleWords: "Default expanded answer reasoning and conclusion, excluding collapsed wrong-option/admin proof.",
      expandedLearnerWords: "All learner-facing answer, reasoning, conclusions, optional notes and wrong-option reasons.",
      diagramLabelWords: "Visible and accessible text extracted from the learner SVG.",
      totalLearnerWords: "Expanded learner words plus diagram label words.",
    },
  },
  localizationDefects: evidence.localizationDefects,
  localizationDefectsFound: undefined,
  automatedRecordEvidence: {
    records: evidence.records,
    logicalLanguageTriplets: evidence.logicalLanguageTriplets,
    breakdowns: evidence.breakdowns,
    answerParity: evidence.automatedLogicEvidence.independentlyDerivedAnswerParity,
    proofElementCoverage: evidence.automatedLogicEvidence.proofElementCoverage,
    explanationParity: evidence.automatedLogicEvidence.explanationParity,
    diagramSemanticParity: evidence.automatedLogicEvidence.diagramSemanticParity,
  },
  duplicateExplanationAudit: evidence.duplicateExplanationAudit,
  diagramEvidence: evidence.diagramEvidence,
  evidenceBoundary: evidence.evidenceBoundary,
  safeguards: {
    ...report.safeguards,
    independentHumanLogicParity: "NOT_RUN",
    humanGeometry360: "NOT_RUN",
    humanGeometry412: "NOT_RUN",
    humanGeometry768: "NOT_RUN",
  },
  evidenceFiles: {
    recordRows: "syl-001-v4-record-evidence.jsonl",
    evidenceSummary: "syl-001-v4-evidence-summary.json",
    evidenceHtml: "SYL-001-V4-Record-Level-Evidence.html",
    learnerReviewHtml: "SYL-001-Structured-Proof-V4-Learner-Simplification-Review.html",
    learnerReviewJsonl: "syl-001-v4-review.jsonl",
  },
};

const sanitized = JSON.parse(JSON.stringify(finalReport));
writeFileSync(reportPath, `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  status: "SYL-001 V4 final combined review exported",
  outputDir,
  records: evidence.records,
  answerParityPass: evidence.automatedLogicEvidence.independentlyDerivedAnswerParity.pass,
  proofCoveragePass: evidence.automatedLogicEvidence.proofElementCoverage.pass,
  literalMemberPhraseRemaining: evidence.localizationDefects.literalMemberPhrase.remainingInV4LearnerSurface,
  duplicatePunctuationRemaining: evidence.localizationDefects.duplicatePunctuation.remainingInV4LearnerSurface,
  duplicateExplanationClusters: evidence.duplicateExplanationAudit.normalizedDuplicateClusters,
  nativeEditorialStatus: "NOT_RUN",
  humanLogicStatus: "NOT_RUN",
  humanGeometryStatus: "NOT_RUN",
  lifecycleStatus: "REVISE",
}, null, 2));
