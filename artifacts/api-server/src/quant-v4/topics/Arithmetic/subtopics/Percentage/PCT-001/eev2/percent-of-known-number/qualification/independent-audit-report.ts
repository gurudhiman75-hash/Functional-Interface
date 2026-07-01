import {
  runIndependentAudit,
  type IndependentAuditDimension,
  type IndependentAuditExampleResult,
  type IndependentAuditFinding,
} from "./independent-audit";
import { INDEPENDENT_AUDIT_CORPUS } from "./independent-audit-corpus";

export interface IndependentAuditDimensionSummary {
  dimension: IndependentAuditDimension;
  examplesWithFindings: number;
  critical: number;
  major: number;
  minor: number;
}

export interface IndependentAuditReport {
  reportId: "QUAL-001:PHASE-B.1";
  totalExamples: number;
  approvedExamples: number;
  criticalFindings: readonly IndependentAuditFinding[];
  majorFindings: readonly IndependentAuditFinding[];
  minorFindings: readonly IndependentAuditFinding[];
  dimensionSummaries: readonly IndependentAuditDimensionSummary[];
  examplesNeedingReview: readonly IndependentAuditExampleResult[];
  examplesFullyApproved: readonly IndependentAuditExampleResult[];
  targetAssessment: {
    criticalBelowOrEqualZero: boolean;
    majorBelowTen: boolean;
    minorBelowTen: boolean;
    approvedAboveFortyFive: boolean;
  };
}

const DIMENSIONS: readonly IndependentAuditDimension[] = [
  "TUTOR_REALISM",
  "ONE_UNIT_VISIBILITY",
  "SIMPLICITY",
  "COGNITIVE_LOAD",
  "ANSWER_CONFIDENCE",
  "TRANSITION_QUALITY",
  "AI_SMELL",
  "BOOK_SMELL",
  "REPETITION_FATIGUE",
  "TUTOR_PERSONALITY",
];

export function produceIndependentAuditReport(): IndependentAuditReport {
  const results = runIndependentAudit(INDEPENDENT_AUDIT_CORPUS);
  const findings = results.flatMap((result) => result.findings);
  const critical = findings.filter((finding) => finding.severity === "CRITICAL");
  const major = findings.filter((finding) => finding.severity === "MAJOR");
  const minor = findings.filter((finding) => finding.severity === "MINOR");
  const approved = results.filter((result) => result.fullyApproved);
  return {
    reportId: "QUAL-001:PHASE-B.1",
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
        examplesWithFindings: new Set(
          relevant.map((finding) => finding.auditId),
        ).size,
        critical: relevant.filter(
          (finding) => finding.severity === "CRITICAL",
        ).length,
        major: relevant.filter((finding) => finding.severity === "MAJOR")
          .length,
        minor: relevant.filter((finding) => finding.severity === "MINOR")
          .length,
      };
    }),
    examplesNeedingReview: results.filter((result) => !result.fullyApproved),
    examplesFullyApproved: approved,
    targetAssessment: {
      criticalBelowOrEqualZero: critical.length === 0,
      majorBelowTen: major.length < 10,
      minorBelowTen: minor.length < 10,
      approvedAboveFortyFive: approved.length > 45,
    },
  };
}

export const INDEPENDENT_AUDIT_REPORT = produceIndependentAuditReport();

