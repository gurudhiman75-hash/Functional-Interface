import {
  CONFIRMATION_CORPUS,
  CONFIRMATION_FATIGUE_CORPUS,
  type ConfirmationCategory,
} from "./confirmation-corpus";
import {
  runConfirmationAudit,
  runConfirmationFatigueStudy,
  type ConfirmationDimension,
  type ConfirmationExampleResult,
  type ConfirmationFatigueResult,
  type ConfirmationFinding,
} from "./confirmation-run";

export interface ConfirmationDimensionSummary {
  dimension: ConfirmationDimension;
  affectedExamples: number;
  criticalFindings: number;
  majorFindings: number;
  minorFindings: number;
}

export interface ConfirmationCategorySummary {
  category: ConfirmationCategory;
  totalExamples: number;
  approvedExamples: number;
  rejectedExamples: number;
}

export interface ConfirmationReport {
  reportId: "QUAL-001-C1";
  totalExamples: number;
  approvedExamples: number;
  criticalFindings: readonly ConfirmationFinding[];
  majorFindings: readonly ConfirmationFinding[];
  minorFindings: readonly ConfirmationFinding[];
  dimensionSummaries: readonly ConfirmationDimensionSummary[];
  categorySummaries: readonly ConfirmationCategorySummary[];
  examplesRequiringFutureReview: readonly ConfirmationExampleResult[];
  examplesApproved: readonly ConfirmationExampleResult[];
  fatigueStudy: ConfirmationFatigueResult;
  successTarget: {
    criticalZero: boolean;
    majorAtMostFive: boolean;
    minorAtMostFive: boolean;
    approvedAtLeastTwoHundredNinetyFive: boolean;
    fatigueAcceptable: boolean;
  };
}

const DIMENSIONS: readonly ConfirmationDimension[] = [
  "TUTOR_REALISM",
  "ONE_UNIT_VISIBILITY",
  "DIVISION_INTENT",
  "MULTIPLICATION_INTENT",
  "ANSWER_CONFIDENCE",
  "CONTEXT_PERSISTENCE",
  "COMPOUND_LABELS",
  "ENTITY_REALISM",
  "MONEY_REALISM",
  "NUMBER_FORMATTING",
  "TRANSITION_QUALITY",
  "PERSONALITY",
  "TEMPLATE_FATIGUE",
  "WEAK_STUDENT_FRIENDLINESS",
  "NATURALNESS",
];

const CATEGORIES: readonly ConfirmationCategory[] = [
  "ABSTRACT",
  "MONEY",
  "COUNT",
  "CONTINUOUS",
  "COMPOUND_CONTEXT",
  "WEAK_STUDENT",
  "PATHOLOGICAL_DECIMAL",
  "EXTREME_REALISTIC",
  "EQUAL_RATE",
  "POLICY_REJECTION",
];

export function produceConfirmationReport(): ConfirmationReport {
  const results = runConfirmationAudit(CONFIRMATION_CORPUS);
  const findings = results.flatMap((result) => result.findings);
  const critical = findings.filter((entry) => entry.severity === "CRITICAL");
  const major = findings.filter((entry) => entry.severity === "MAJOR");
  const minor = findings.filter((entry) => entry.severity === "MINOR");
  const approved = results.filter((result) => result.approved);
  const fatigueStudy = runConfirmationFatigueStudy(
    CONFIRMATION_FATIGUE_CORPUS,
  );
  return {
    reportId: "QUAL-001-C1",
    totalExamples: results.length,
    approvedExamples: approved.length,
    criticalFindings: critical,
    majorFindings: major,
    minorFindings: minor,
    dimensionSummaries: DIMENSIONS.map((dimension) => {
      const relevant = findings.filter(
        (finding) => finding.dimension === dimension,
      );
      return {
        dimension,
        affectedExamples: new Set(
          relevant.map((finding) => finding.confirmationId),
        ).size,
        criticalFindings: relevant.filter(
          (finding) => finding.severity === "CRITICAL",
        ).length,
        majorFindings: relevant.filter(
          (finding) => finding.severity === "MAJOR",
        ).length,
        minorFindings: relevant.filter(
          (finding) => finding.severity === "MINOR",
        ).length,
      };
    }),
    categorySummaries: CATEGORIES.map((category) => {
      const relevant = results.filter(
        (result) => result.category === category,
      );
      return {
        category,
        totalExamples: relevant.length,
        approvedExamples: relevant.filter((result) => result.approved).length,
        rejectedExamples: relevant.filter((result) => result.rejected).length,
      };
    }),
    examplesRequiringFutureReview: results.filter(
      (result) => !result.approved,
    ),
    examplesApproved: approved,
    fatigueStudy,
    successTarget: {
      criticalZero: critical.length === 0,
      majorAtMostFive: major.length <= 5,
      minorAtMostFive: minor.length <= 5,
      approvedAtLeastTwoHundredNinetyFive: approved.length >= 295,
      fatigueAcceptable: fatigueStudy.acceptable,
    },
  };
}

export const CONFIRMATION_REPORT = produceConfirmationReport();

