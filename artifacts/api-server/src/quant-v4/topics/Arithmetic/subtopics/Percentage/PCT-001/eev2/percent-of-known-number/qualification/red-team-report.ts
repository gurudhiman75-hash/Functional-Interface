import {
  RED_TEAM_CORPUS,
  RED_TEAM_FATIGUE_CORPUS,
  type RedTeamCategory,
} from "./red-team-corpus";
import {
  runRedTeamAudit,
  runRedTeamFatigueStudy,
  type RedTeamExampleResult,
  type RedTeamFatigueResult,
  type RedTeamFinding,
} from "./red-team";

export interface RedTeamCategorySummary {
  category: RedTeamCategory;
  totalExamples: number;
  approvedExamples: number;
  criticalFindings: number;
  majorFindings: number;
  minorFindings: number;
}

export interface RedTeamReport {
  reportId: "QUAL-001-C";
  totalExamples: number;
  approvedExamples: number;
  criticalFindings: readonly RedTeamFinding[];
  majorFindings: readonly RedTeamFinding[];
  minorFindings: readonly RedTeamFinding[];
  categorySummaries: readonly RedTeamCategorySummary[];
  examplesRequiringFutureRealismWork: readonly RedTeamExampleResult[];
  examplesApproved: readonly RedTeamExampleResult[];
  fatigueStudy: RedTeamFatigueResult;
  successTarget: {
    criticalZero: boolean;
    majorBelowFifteen: boolean;
    minorBelowFifteen: boolean;
    approvedAboveOneHundredEighty: boolean;
    fatigueAcceptable: boolean;
  };
}

const CATEGORIES: readonly RedTeamCategory[] = [
  "ABSURD_CONTEXT",
  "FRACTIONAL_HUMANS",
  "UGLY_DECIMALS",
  "MONEY_REALISM",
  "EXTREME_PERCENTAGES",
  "EQUAL_RATES",
  "LARGE_VALUES",
  "VERY_SMALL_VALUES",
  "TEMPLATE_FATIGUE",
  "WEAK_STUDENT",
];

export function produceRedTeamReport(): RedTeamReport {
  const results = runRedTeamAudit(RED_TEAM_CORPUS);
  const findings = results.flatMap((result) => result.findings);
  const critical = findings.filter((finding) => finding.severity === "CRITICAL");
  const major = findings.filter((finding) => finding.severity === "MAJOR");
  const minor = findings.filter((finding) => finding.severity === "MINOR");
  const approved = results.filter((result) => result.approved);
  const fatigueStudy = runRedTeamFatigueStudy(RED_TEAM_FATIGUE_CORPUS);
  return {
    reportId: "QUAL-001-C",
    totalExamples: results.length,
    approvedExamples: approved.length,
    criticalFindings: critical,
    majorFindings: major,
    minorFindings: minor,
    categorySummaries: CATEGORIES.map((category) => {
      const categoryResults = results.filter(
        (result) => result.category === category,
      );
      const categoryFindings = categoryResults.flatMap(
        (result) => result.findings,
      );
      return {
        category,
        totalExamples: categoryResults.length,
        approvedExamples: categoryResults.filter((result) => result.approved)
          .length,
        criticalFindings: categoryFindings.filter(
          (finding) => finding.severity === "CRITICAL",
        ).length,
        majorFindings: categoryFindings.filter(
          (finding) => finding.severity === "MAJOR",
        ).length,
        minorFindings: categoryFindings.filter(
          (finding) => finding.severity === "MINOR",
        ).length,
      };
    }),
    examplesRequiringFutureRealismWork: results.filter(
      (result) => !result.approved,
    ),
    examplesApproved: approved,
    fatigueStudy,
    successTarget: {
      criticalZero: critical.length === 0,
      majorBelowFifteen: major.length < 15,
      minorBelowFifteen: minor.length < 15,
      approvedAboveOneHundredEighty: approved.length > 180,
      fatigueAcceptable: fatigueStudy.acceptable,
    },
  };
}

export const RED_TEAM_REPORT = produceRedTeamReport();

