import {
  auditTutorCorpus,
  type TutorAuditDimension,
  type TutorAuditExampleResult,
  type TutorAuditFinding,
} from "./human-tutor-audit";
import { TUTOR_AUDIT_CORPUS } from "./tutor-audit-corpus";

export interface TutorAuditDimensionSummary {
  dimension: TutorAuditDimension;
  examplesWithFindings: number;
  criticalFindings: number;
  majorFindings: number;
  minorFindings: number;
}

export interface TutorAuditReport {
  reportId: "QUAL-001:PHASE-B";
  target: "PCT-001/percentOfKnownNumber";
  methodFamily: "UNIT_VALUE";
  totalExamples: number;
  dimensionSummaries: readonly TutorAuditDimensionSummary[];
  criticalFindings: readonly TutorAuditFinding[];
  majorFindings: readonly TutorAuditFinding[];
  minorFindings: readonly TutorAuditFinding[];
  examplesRequiringImprovement: readonly TutorAuditExampleResult[];
  examplesApproved: readonly TutorAuditExampleResult[];
}

const DIMENSIONS: readonly TutorAuditDimension[] = [
  "TUTOR_REALISM",
  "ONE_UNIT_VISIBILITY",
  "SIMPLICITY",
  "COGNITIVE_LOAD",
  "ANSWER_CONFIDENCE",
  "TRANSITION_QUALITY",
  "AI_SMELL",
  "BOOK_SMELL",
];

export function produceTutorAuditReport(): TutorAuditReport {
  const results = auditTutorCorpus(TUTOR_AUDIT_CORPUS);
  const findings = results.flatMap((result) => result.findings);
  return {
    reportId: "QUAL-001:PHASE-B",
    target: "PCT-001/percentOfKnownNumber",
    methodFamily: "UNIT_VALUE",
    totalExamples: results.length,
    dimensionSummaries: DIMENSIONS.map((dimension) => {
      const relevant = findings.filter(
        (finding) => finding.dimension === dimension,
      );
      return {
        dimension,
        examplesWithFindings: new Set(
          relevant.map((finding) => finding.auditId),
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
    criticalFindings: findings.filter(
      (finding) => finding.severity === "CRITICAL",
    ),
    majorFindings: findings.filter(
      (finding) => finding.severity === "MAJOR",
    ),
    minorFindings: findings.filter(
      (finding) => finding.severity === "MINOR",
    ),
    examplesRequiringImprovement: results.filter((result) => !result.approved),
    examplesApproved: results.filter((result) => result.approved),
  };
}

export const TUTOR_AUDIT_REPORT = produceTutorAuditReport();

